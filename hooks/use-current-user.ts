import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  // Client side
  const session = useSession();
  return session.data?.user;
};
