"use server";
import { RegisterSchema } from "@/schemas";
import { z } from "zod";

export async function register(values: z.infer<typeof RegisterSchema>) {
  // Validam pe server
  const validateFileds = RegisterSchema.safeParse(values);
  if (!validateFileds.success) {
    return { error: "Invalid fields!" };
  }
  return { success: "Email sent!" };
}
