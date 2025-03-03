"use server";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

// Acesta se folosesc pentru userii ce folosesc UI
export async function login(values: z.infer<typeof LoginSchema>) {
  // Validam pe server
  const validateFileds = LoginSchema.safeParse(values);
  if (!validateFileds.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password } = validateFileds.data;
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
