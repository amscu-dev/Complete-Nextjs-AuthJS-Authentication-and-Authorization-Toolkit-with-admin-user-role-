import { db } from "@/lib/db";

// Funcția pentru a obține token-ul de verificare pe baza adresei de email
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    // Căutăm token-ul de verificare în baza de date folosind email-ul
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    // Returnează token-ul de verificare găsit
    return verificationToken;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};

// Funcția pentru a obține token-ul de verificare pe baza token-ului
export const getVerificationTokenByToken = async (token: string) => {
  try {
    // Căutăm token-ul de verificare în baza de date folosind token-ul
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    // Returnează token-ul de verificare găsit
    return verificationToken;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};
