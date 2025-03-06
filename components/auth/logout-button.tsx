"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

function LogoutButton({ children }: LogoutButtonProps) {
  // Pentru a folosi sesiunea pe client :
  // const session = useSession();
  // Pentru a folosi sesiunea pe server : auth()
  // Pe client avem signOut din: next-auth/react
  // Putem implementa log-out si pe server, cu server action - similar cu login
  const onClick = () => {
    signOut();
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}

export default LogoutButton;
