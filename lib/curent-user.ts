import { auth } from "@/auth";

// Functiile de mai jos pot fii utilizate in : Server Components, Server Actions si API Routes

export const curentUser = async () => {
  // Server Side
  const session = await auth();
  return session?.user;
};

export const curentRole = async () => {
  // Server Side
  const session = await auth();
  return session?.user.role;
};
