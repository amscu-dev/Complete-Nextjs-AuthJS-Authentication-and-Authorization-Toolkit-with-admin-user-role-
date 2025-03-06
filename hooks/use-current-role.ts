import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  // Client side
  const session = useSession();
  return session.data?.user?.role;
};
