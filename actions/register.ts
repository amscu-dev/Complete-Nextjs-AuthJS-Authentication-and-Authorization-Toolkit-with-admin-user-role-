"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sentVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function register(values: z.infer<typeof RegisterSchema>) {
  // Validăm datele de intrare conform schemelor definite
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validateFields.data;

  // Verificăm dacă utilizatorul există deja în baza de date
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // Criptăm parola utilizatorului pentru securitate
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creăm un nou utilizator în baza de date
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generăm un token de verificare și trimitem email-ul de confirmare
  const verificationToken = await generateVerificationToken(email);
  await sentVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
}
