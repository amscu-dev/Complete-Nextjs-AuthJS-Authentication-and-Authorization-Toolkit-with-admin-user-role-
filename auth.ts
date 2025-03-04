import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";
// Sintaxa pentru ca Prisma sa poata fii utilizat pe edge.
// NextAuth creează automat un utilizator în baza de date când cineva se autentifică cu OAuth, dar doar dacă folosești un adapter, cum ar fi PrismaAdapter.
// În NextAuth, callback-urile jwt și session sunt executate la fiecare request pentru a menține sesiunea actualizată și validă.
/*
Când se execută jwt?
1️⃣ La login – când user-ul se autentifică pentru prima dată.
2️⃣ La fiecare request către server – pentru a verifica dacă token-ul este încă valid.
3️⃣ La fiecare refresh token (dacă există refresh logic implementat).
*/
// Session nu este stocată permanent pe server (pentru strategy: "jwt"
// Session se execută, astfel de fiecare data cand tokenul JWT se schimba, deci la fiecare request pentru a reconstrui sesiunea din token.
// Callback-urile jwt și session se execută înainte ca răspunsul să plece către client
export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    // Pentru cei ce folosesc OAuth modificam automat in baza de date emailVerified
    async linkAccount({ user }) {
      // se execută după ce contul este asociat în baza de date, dar înainte ca sesiunea să fie actualizată. (dupa signIn)
      console.log("SE EXECUTA EVENT UL linkACCOUNT");
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("SE EXECUTA CALLBACK-UL SIGN-IN");
      console.log(user, account);
      // Se execută după autentificarea de la provider, înainte ca utilizatorul să fie stocat în sesiune.
      // Daca nu am folosi un adater precum Prisma, in acest pas ar trebui sa cream un user in baza de date pe baza informatiilor primite de OAuth Provider.
      // 1. ALLOW OAuth without email verification.
      if (account?.provider !== "credentials") return true;
      // 2. BLOCK Credentials without email verification.
      const existingUser = await getUserById(user.id);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      return true; // Permitem autentificarea să continue
    },
    async session({ token, session }) {
      // Se execută după jwt, când sesiunea este generată și trimisă către client.
      console.log("SE EXECUTA CALLBACK-UL SESSION");
      console.log({ sessionToken: token });
      if (token.sub && session.user) {
        // Atasam id user-ului la sesiunea curenta
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      console.log({ session: session });
      return session; // Sesiunea finala impreuna cu cererea de redirectionare merge catre utilizator
    },
    async jwt({ token, user, profile, trigger }) {
      // Se execută după signIn, dar înainte ca token-ul JWT să fie generat.
      console.log("SE EXECUTA CALLBACK-UL JWT");
      console.log({ token });
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token; // Permitem crearea sesiunii
    },
  },
  // OAuth cu Auth.js (NextAuth.js) și Prisma, un utilizator este creat automat în baza de date dacă folosești PrismaAdapter
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
