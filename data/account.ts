import { db } from "@/lib/db";

// Funcția pentru a obține un cont după ID-ul utilizatorului
export const getAccountByUserId = async (userId: string) => {
  try {
    // Apelează baza de date pentru a găsi primul cont asociat cu userId
    const account = await db.account.findFirst({
      where: { userId }, // Filtrare pe baza userId
    });

    // Returnează contul găsit
    return account;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};
