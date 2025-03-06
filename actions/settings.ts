"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { curentUser } from "@/lib/curent-user";
import { db } from "@/lib/db";
import { sentVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import z from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // Obținem utilizatorul curent pe baza sesiunii active
  const user = await curentUser();
  if (!user) {
    return { error: "Unauthorized!" };
  }

  // Verificăm dacă utilizatorul există în baza de date
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized!" };
  }

  // Dacă utilizatorul este autentificat prin OAuth, anumite câmpuri nu pot fi modificate
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // Gestionăm schimbarea email-ului
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    // Generăm un token de verificare și trimitem email-ul de confirmare
    const verificationToken = await generateVerificationToken(values.email);
    await sentVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification Email Sent!" };
  }

  // Gestionăm schimbarea parolei
  if (values.password && values.newPassword && dbUser.password) {
    // Verificăm dacă parola curentă este corectă
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) {
      return { error: "Incorrect password!" };
    }

    // Criptăm noua parolă înainte de a o salva în baza de date
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  // Actualizăm setările utilizatorului în baza de date
  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });

  return { success: "Settings Updated!" };
};
