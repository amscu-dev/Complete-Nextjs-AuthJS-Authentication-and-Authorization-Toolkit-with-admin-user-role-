import { db } from "@/lib/db";

// Funcția pentru a obține un token de resetare a parolei pe baza email-ului
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    // Apelează baza de date pentru a găsi primul token de resetare a parolei asociat cu email-ul
    const passwordResetToken = await db.resetPasswordToken.findFirst({
      where: { email }, // Căutare pe baza email-ului
    });

    // Returnează token-ul găsit
    return passwordResetToken;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};

// Funcția pentru a obține un token de resetare a parolei pe baza token-ului
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    // Apelează baza de date pentru a găsi un token de resetare a parolei pe baza token-ului
    const passwordResetToken = await db.resetPasswordToken.findUnique({
      where: { token }, // Căutare pe baza token-ului
    });

    // Returnează token-ul găsit
    return passwordResetToken;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};
