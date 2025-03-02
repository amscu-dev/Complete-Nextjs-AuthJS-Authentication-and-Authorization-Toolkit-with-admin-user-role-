"use server";
import { LoginSchema } from "@/schemas";
import { z } from "zod";

export async function login(values: z.infer<typeof LoginSchema>) {
  // Validam pe server
  const validateFileds = LoginSchema.safeParse(values);
  if (!validateFileds.success) {
    return { error: "Invalid fields!" };
  }
  return { success: "Email sent!" };
}
