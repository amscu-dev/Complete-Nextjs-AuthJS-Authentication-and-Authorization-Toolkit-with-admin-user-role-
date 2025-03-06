"use client";
import UserInfo from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

function ClientPage() {
  // Acesta este un exemplu pentru menipularea user-ului pe client;
  const user = useCurrentUser();
  return <UserInfo user={user} label="👤 Client Component" />;
}

export default ClientPage;
