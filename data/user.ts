import { db } from "@/lib/db";

// Funcția pentru a obține utilizatorul pe baza adresei de email
export const getUserByEmail = async (email: string) => {
  try {
    // Căutăm utilizatorul în baza de date folosind email-ul
    const user = await db.user.findUnique({ where: { email } });

    // Returnează utilizatorul găsit
    return user;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};

// Funcția pentru a obține utilizatorul pe baza ID-ului
export const getUserById = async (id: string | undefined) => {
  try {
    // Căutăm utilizatorul în baza de date folosind ID-ul
    const user = await db.user.findUnique({ where: { id } });

    // Returnează utilizatorul găsit
    return user;
  } catch {
    // În caz de eroare, returnează null
    return null;
  }
};
