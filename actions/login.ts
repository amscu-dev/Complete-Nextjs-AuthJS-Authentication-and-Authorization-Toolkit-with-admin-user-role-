"use server";
import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorEmail, sentVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export async function login(
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) {
  // Validăm input-ul pe server folosind schema definită în LoginSchema
  const validateFileds = LoginSchema.safeParse(values);
  if (!validateFileds.success) {
    return { error: "Invalid fields!" };
  }

  // Extragem email-ul, parola și codul 2FA din datele validate
  const { email, password, code } = validateFileds.data;
  const existingUser = await getUserByEmail(email);

  // Verificăm dacă utilizatorul există și are email și parolă setate
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }

  // Verificăm dacă email-ul utilizatorului este confirmat
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    // Trimitem email-ul de verificare
    await sentVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Please confirm your email first!" };
  }

  // Verificăm dacă utilizatorul are autentificare 2FA activată
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // Verificăm dacă există un token 2FA generat pentru acest email
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid  2FA code" };
      }

      // Verificăm dacă token-ul a expirat
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "2FA code expired, please login again!" };
      }

      // Ștergem token-ul 2FA din baza de date după ce a fost utilizat
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      // Ștergem confirmarea anterioară 2FA dacă există
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      // Creăm în baza de date un entry pentru twoFactorConfirmation
      // Aceasta va fi verificată de callback-ul de signIn
      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      // Dacă utilizatorul nu a introdus codul, generăm un nou token 2FA și îl trimitem pe email
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  // Apelăm funcția signIn din NextAuth pentru autentificare cu email și parolă
  // NextAuth va folosi authorize(credentials) definit în auth.config.ts
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
