import UserInfo from "@/components/user-info";
import { curentUser } from "@/lib/curent-user";

async function ServerPage() {
  // Acesta este un exemplu pentru manipularea user-ului pe server;
  const user = await curentUser();
  return <UserInfo user={user} label="💻 Server Component" />;
}

export default ServerPage;
