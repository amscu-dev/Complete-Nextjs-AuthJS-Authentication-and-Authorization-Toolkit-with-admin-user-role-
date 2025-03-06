import { db } from "@/lib/db";

// Funcția pentru a obține token-ul 2FA pe baza adresei de email
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    // Căutăm token-ul 2FA asociat cu adresa de email
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email }, // Căutare pe baza email-ului
    });

    // Returnează token-ul 2FA găsit
    return twoFactorToken;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};

// Funcția pentru a obține token-ul 2FA pe baza token-ului specific
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    // Căutăm token-ul 2FA în baza de date folosind token-ul dat
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token }, // Căutare pe baza token-ului
    });

    // Returnează token-ul 2FA găsit
    return twoFactorToken;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};
