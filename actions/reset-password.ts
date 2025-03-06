"use server";

import { getUserByEmail } from "@/data/user";
import { sentPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "@/schemas";
import { z } from "zod";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  // Validăm formatul email-ului folosind schema definită
  const validateFields = ResetPasswordSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid email format!" };
  }

  const { email } = validateFields.data;

  // Verificăm dacă utilizatorul există în baza de date
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found! Please register!" };
  }

  // Generăm un token de resetare a parolei și trimitem email-ul aferent
  const passwordResetToken = await generatePasswordResetToken(email);
  await sentPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};
