import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
// providers credetials in cazul in care userii nu folosesc varianta pentru UI
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateFileds = LoginSchema.safeParse(credentials);
        if (validateFileds.success) {
          const { email, password } = validateFileds.data;
          const user = await getUserByEmail(email);
          // in cazul in care ne inregistram folosind OAuth atunci va exista un email in baza de date dar nu va exista o parola
          // Daca nu exista user => nu este inregistram
          // Daca exista email dar nu exista parola => este inregistrat dar nu poate folosi autentificarea prin credentiale
          if (!user || !user.password) return null;
          // Daca exista si user si parola, verificam daca parola este corecta!
          const passwordMatch = await bcrypt.compare(password, user.password);
          // Dacă authorize returnează un user valid, NextAuth va considera că autentificarea a avut loc cu succes și va genera un cookie de sesiune pentru utilizator.
          if (passwordMatch) return user;
        }
        /*
        authorize nu aruncă erori, dar returnează null în caz de eșec.
        NextAuth se ocupă de eroare și o returnează ca parte din rezultatul obținut prin signIn.
        Eroarea este capturată atunci când verifici câmpul error din rezultatul signIn
        */
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

// Acest fisier este obligatoriu deoarece Prisma nu functioneaza pe Edge;
// Acest fisier va fii folosit pentru a apela middleware -ul
