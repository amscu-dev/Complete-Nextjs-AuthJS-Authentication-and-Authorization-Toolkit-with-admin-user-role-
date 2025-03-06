import { db } from "@/lib/db";

// Funcția pentru a obține confirmarea de 2FA pe baza userId-ului
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    // Apelează baza de date pentru a găsi prima confirmare 2FA asociată cu userId-ul
    const twoFactorConfirmation = await db.twoFactorConfirmation.findFirst({
      where: { userId }, // Căutare pe baza userId-ului
    });

    // Returnează confirmarea de 2FA găsită
    return twoFactorConfirmation;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};
