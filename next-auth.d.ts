import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: "ADMIN" | "USER";
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  email: string;
  name: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
