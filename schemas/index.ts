import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .nonempty({ message: "Password is required" }) // Parola este obligatorie
    .min(8, { message: "Password must be at least 8 characters long" }) // Minim 8 caractere
    .regex(/[A-Z]/, { message: "Password must start with a capital letter" }) // Începe cu literă mare
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }), // Conține un simbol special
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .nonempty({ message: "Password is required" }) // Parola este obligatorie
    .min(8, { message: "Password must be at least 8 characters long" }) // Minim 8 caractere
    .regex(/[A-Z]/, { message: "Password must start with a capital letter" }) // Începe cu literă mare
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }), // Conține un simbol special

  name: z.string().min(1, {
    message: "Name is required",
  }),
});
