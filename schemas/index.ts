import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(
      z
        .string()
        .nonempty({ message: "Password is required" }) // Parola este obligatorie
        .min(8, { message: "Password must be at least 8 characters long" }) // Minim 8 caractere
        .regex(/[A-Z]/, {
          message: "Password must start with a capital letter",
        }) // Începe cu literă mare
        .regex(/[\W_]/, {
          message: "Password must contain at least one special character",
        })
    ),
    newPassword: z.optional(
      z
        .string()
        .nonempty({ message: "Password is required" }) // Parola este obligatorie
        .min(8, { message: "Password must be at least 8 characters long" }) // Minim 8 caractere
        .regex(/[A-Z]/, {
          message: "Password must start with a capital letter",
        }) // Începe cu literă mare
        .regex(/[\W_]/, {
          message: "Password must contain at least one special character",
        })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

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
  code: z.optional(z.string()),
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

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Please provide us your email",
  }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .nonempty({ message: "Please provide us a valid password" }) // Parola este obligatorie
    .min(8, { message: "Password must be at least 8 characters long" }) // Minim 8 caractere
    .regex(/[A-Z]/, { message: "Password must start with a capital letter" }) // Începe cu literă mare
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }), // Conține un simbol special,
});
