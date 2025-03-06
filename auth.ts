import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getAccountByUserId } from "./data/account";
import { getUserById } from "./data/user";

// NOTE IMPORTANTE:
// 1. Prisma poate fi folosită pe edge cu NextAuth prin PrismaAdapter
// 2. NextAuth creează automat un utilizator în baza de date când cineva se autentifică cu OAuth, dar doar dacă folosești un adapter, cum ar fi PrismaAdapter.
// 3. Callback-urile 'jwt' și 'session' sunt executate la fiecare request pentru a menține sesiunea actualizată și validă.
// 4. Când se execută jwt?
// 4.1 La login – când user-ul se autentifică pentru prima dată.
// 4.2 La fiecare request către server – pentru a verifica dacă token-ul este încă valid.
// 4.3 La fiecare refresh token (dacă există refresh logic implementat).
// 5. Session nu este stocată permanent pe server (pentru strategy: "jwt"
// 6. Session se execută, astfel de fiecare data cand tokenul JWT se schimba, deci la fiecare request pentru a reconstrui sesiunea din token.
// 7. Callback-urile jwt și session se execută înainte ca răspunsul să plece către client.

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  // Configurarea paginilor pentru autentificare
  pages: {
    signIn: "/auth/login", // Pagină de login
    error: "/auth/error", // Pagină de eroare
  },

  // Evenimentele din NextAuth
  events: {
    async linkAccount({ user }) {
      // Evenimentul care se execută după asocierea unui cont OAuth cu utilizatorul în baza de date
      await db.user.update({
        where: { id: user.id }, // Actualizăm utilizatorul cu data de verificare a email-ului
        data: { emailVerified: new Date() }, // Setăm emailVerified la data curentă
      });
    },
  },

  // Callback-urile NextAuth
  callbacks: {
    // Callback pentru procesul de autentificare
    // Se execută după autentificarea de la provider, înainte ca utilizatorul să fie stocat în sesiune.
    async signIn({ user, account }) {
      console.log(user, account);

      // 1. Permitem autentificarea OAuth fără verificarea email-ului
      if (account?.provider !== "credentials") return true;

      // 2. Blocăm autentificarea cu credențiale fără verificarea email-ului
      const existingUser = await getUserById(user.id);
      if (!existingUser || !existingUser.emailVerified) {
        return false; // Dacă email-ul nu este verificat, blocăm autentificarea
      }

      // 3. Verificare 2FA
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false; // Dacă nu există confirmare 2FA, blocăm autentificarea
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }, // Ștergem confirmarea 2FA pentru următoarea autentificare
        });
      }
      return true; // Permitem autentificarea
    },

    // Callback pentru sesiune
    // Se execută după jwt, când sesiunea este generată și trimisă către client.
    async session({ token, session }) {
      // Atribuim valorile din token la sesiunea curentă
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      // Actualizăm sesiunea cu informațiile utilizatorului (update())
      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      console.log({ session: session });
      return session; // Returnăm sesiunea finală
    },

    // Callback pentru generarea JWT
    // Se execută după signIn, dar înainte ca token-ul JWT să fie generat.
    async jwt({ token }) {
      // Verificăm și adăugăm informațiile necesare în token
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      // Verificăm dacă utilizatorul s-a logat prin OAuth
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.isOAuth = !!existingAccount; // Setăm isOAuth dacă există un cont asociat OAuth

      // Actualizăm token-ul cu informațiile utilizatorului
      token.name = existingUser.name;
      token.email = existingUser.email;
      return token; // Permitem crearea token-ului JWT
    },
  },

  // Configurarea PrismaAdapter
  adapter: PrismaAdapter(db),

  // Folosim strategia JWT pentru sesiune
  session: { strategy: "jwt" },

  // Configurația suplimentară NextAuth
  ...authConfig,
});
