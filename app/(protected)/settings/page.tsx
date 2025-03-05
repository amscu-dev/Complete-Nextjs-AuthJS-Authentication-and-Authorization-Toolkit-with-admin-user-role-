"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession, signOut } from "next-auth/react";

function SettingsPage() {
  // Pentru a folosi sesiunea pe client :
  // const session = useSession();
  // Pentru a folosi sesiunea pe server : auth()
  // Pe client avem signOut din: next-auth/react
  // Putem implementa log-out si pe server, cu server action - similar cu login
  const onClick = () => {
    signOut();
  };
  const user = useCurrentUser();
  return (
    <div className="bg-white p-10 rounded-xl">
      <button type="submit" onClick={onClick}>
        Sign Out
      </button>
    </div>
  );
}

export default SettingsPage;
