"use server";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sentVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/tokens";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

// Acesta se folosesc pentru userii ce folosesc UI
export async function login(values: z.infer<typeof LoginSchema>) {
  console.log("SE EXECUTA LOGIN SERVER ACTION");
  // Validam pe server
  const validateFileds = LoginSchema.safeParse(values);
  if (!validateFileds.success) {
    return { error: "Invalid fields!" };
  }
  const { email, password, code } = validateFileds.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials!" };
  }
  // Prima data verificam daca User-ul are email-ul verificat
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
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid  2FA code" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "2FA code expired, please login again!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      // Cream in baza de date twoFactorConfirmation inainte de signIn(adica chiar inainte de authorize - din credetials, iar ulterior callback-ul signIn ce se executa dupa autorizare, va verifica daca user-ul ce tocmai s a autentificat are twoFactorConfirmation )
      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      // Pentru prima actionare a butonului login, returnam user-ului obicetul ce va genera re-randarea UI
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
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
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
