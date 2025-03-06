"use server";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  // Verificăm dacă token-ul a fost furnizat
  if (!token) return { error: "Missing token!" };

  // Validăm datele primite folosind schema definită
  const validatedFileds = NewPasswordSchema.safeParse(values);
  if (!validatedFileds.success) {
    return { error: "Invalid Fields!" };
  }

  // Extragem parola validată din datele primite
  const { password } = validatedFileds.data;

  // Căutăm token-ul de resetare a parolei în baza de date
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exists!" };
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

  // Hash-uim noua parolă înainte de a o stoca în baza de date
  const hashedPassword = await bcrypt.hash(password, 10);

  // Actualizăm parola utilizatorului în baza de date
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  // Ștergem token-ul de resetare a parolei după utilizare
  await db.resetPasswordToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated! You will be redirected to login!" };
};
