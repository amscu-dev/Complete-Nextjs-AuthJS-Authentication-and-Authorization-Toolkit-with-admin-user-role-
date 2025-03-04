"use server";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { userAgent } from "next/server";
import { sentVerificationEmail } from "@/lib/mail";

// Acesta se folosesc pentru userii ce folosesc UI
export async function login(values: z.infer<typeof LoginSchema>) {
  console.log("SE EXECUTA LOGIN SERVER ACTION");
  // Validam pe server
  const validateFileds = LoginSchema.safeParse(values);
  if (!validateFileds.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password } = validateFileds.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }
  // In cazul in care user-ul nu are email-ul verificat
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sentVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Please confirm your email first!" };
  }
  // Când apelezi signIn("credentials", {...}) în funcția login, NextAuth va folosi authorize(credentials) definit în auth.config.ts
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}
