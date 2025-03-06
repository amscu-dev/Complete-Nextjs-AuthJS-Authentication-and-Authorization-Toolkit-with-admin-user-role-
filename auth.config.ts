// Importăm pachetele necesare pentru autentificare
import bcrypt from "bcryptjs"; // Folosit pentru compararea parolelor criptate
import type { NextAuthConfig } from "next-auth"; // Tipurile necesare pentru configurația NextAuth
import Credentials from "next-auth/providers/credentials"; // Provider pentru autentificare cu credențiale (email/parolă)
import Github from "next-auth/providers/github"; // Provider pentru autentificare cu GitHub
import Google from "next-auth/providers/google"; // Provider pentru autentificare cu Google
import { getUserByEmail } from "./data/user"; // Funcția care caută utilizatorii după email
import { LoginSchema } from "./schemas"; // Schema de validare a datelor de login

// Configurarea NextAuth
export default {
  providers: [
    // Provider pentru Google OAuth
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID, // Client ID pentru autentificarea Google
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret pentru autentificarea Google
    }),
    // Provider pentru GitHub OAuth
    Github({
      clientId: process.env.GITHUB_CLIENT_ID, // Client ID pentru autentificarea GitHub
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Client Secret pentru autentificarea GitHub
    }),
    // Provider pentru autentificare cu credențiale (email + parolă)
    Credentials({
      // Funcția care autorizează un utilizator cu credențiale (email + parolă)
      async authorize(credentials) {
        console.log("SE EXECUTA AUTHORIZE-CREDENTIALS-PROVIDER");

        // Validăm datele de autentificare folosind schema LoginSchema
        const validateFields = LoginSchema.safeParse(credentials);

        // Dacă validarea este reușită
        if (validateFields.success) {
          const { email, password } = validateFields.data; // Extragem email-ul și parola

          // Căutăm utilizatorul în baza de date folosind email-ul
          const user = await getUserByEmail(email);

          // Verificăm dacă există un utilizator cu email-ul respectiv și dacă are o parolă setată
          // În cazul autentificării prin OAuth, utilizatorul poate avea un email, dar nu și o parolă
          if (!user || !user.password) return null; // Dacă nu există utilizator sau nu există parolă, returnăm null

          // Dacă există un utilizator cu parolă, comparăm parola trimisă cu cea stocată
          const passwordMatch = await bcrypt.compare(password, user.password);

          // Dacă parolele se potrivesc, returnăm utilizatorul
          if (passwordMatch) return user;
        }

        // Dacă nu se potrivesc, autorizația eșuează și returnăm null
        // NextAuth va gestiona eroarea și o va include în rezultatele autentificării
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

// Notă: Acest fișier este obligatoriu, deoarece Prisma nu funcționează pe Edge;
// Fișierul este folosit pentru a apela middleware-ul NextAuth.
