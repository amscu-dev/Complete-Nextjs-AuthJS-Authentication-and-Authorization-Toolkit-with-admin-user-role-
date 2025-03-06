"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  // Verificăm dacă token-ul există în baza de date
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  // Verificăm dacă token-ul a expirat
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  // Căutăm utilizatorul asociat cu token-ul
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  // Actualizăm câmpul emailVerified al utilizatorului
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(), // Setăm timestamp-ul verificării email-ului
      email: existingUser.email,
    },
  });

  // Ștergem token-ul de verificare după utilizare
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
