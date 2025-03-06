import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { db } from "@/lib/db";
import crypto from "crypto"; // Folosit pentru generarea de token-uri aleatorii
import { v4 as uuidv4 } from "uuid"; // Folosit pentru generarea de UUID-uri

// Funcția pentru generarea unui token de două factori
export const generateTwoFactorToken = async (email: string) => {
  // Generăm un token aleator de 6 cifre
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 2 * 60 * 1000); // Token-ul expiră în 2 minute

  // Verificăm dacă există deja un token pentru acest email
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    // Dacă există un token, îl ștergem
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Creăm un nou token pentru două factori în baza de date
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken; // Returnăm noul token generat
};

// Funcția pentru generarea unui token de verificare a email-ului
export const generateVerificationToken = async (email: string) => {
  // Generăm un token unic folosind UUID
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Token-ul expiră în 1 oră

  // Verificăm dacă există deja un token de verificare pentru acest email
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    // Dacă există un token, îl ștergem
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Creăm un nou token de verificare în baza de date
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken; // Returnăm noul token de verificare
};

// Funcția pentru generarea unui token de resetare a parolei
export const generatePasswordResetToken = async (email: string) => {
  // Generăm un token unic folosind UUID
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Token-ul expiră în 1 oră

  // Verificăm dacă există deja un token de resetare a parolei pentru acest email
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    // Dacă există un token, îl ștergem
    await db.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Creăm un nou token de resetare a parolei în baza de date
  const passwordResetToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken; // Returnăm noul token de resetare a parolei
};
