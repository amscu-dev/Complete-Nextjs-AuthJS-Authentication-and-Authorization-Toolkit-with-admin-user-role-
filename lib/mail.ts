import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sentVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: "mail@nextauthv5-complete-toolkit.xyz",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sentPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "mail@nextauthv5-complete-toolkit.xyz",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${confirmLink}">here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "mail@nextauthv5-complete-toolkit.xyz",
    to: email,
    subject: "2FA Code",
    html: `<p>Here its your 2FA code: ${token}</p>`,
  });
};
