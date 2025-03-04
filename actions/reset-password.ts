"use server";
import { getUserByEmail } from "@/data/user";
import { ResetPasswordSchema } from "@/schemas";
import { z } from "zod";
import { sentPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  const validateFields = ResetPasswordSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid email format!" };
  }
  const { email } = validateFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Email not found! Please register!" };
  }
  const passwordResetToken = await generatePasswordResetToken(email);
  await sentPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Reset email sent!" };
};
