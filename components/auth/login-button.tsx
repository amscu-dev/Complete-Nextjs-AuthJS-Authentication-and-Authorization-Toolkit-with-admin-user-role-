"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import LoginForm from "./login-form";

interface ButtonLoginProp {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}
function LoginButton({
  children,
  mode = "redirect",
  asChild,
}: ButtonLoginProp) {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
}

export default LoginButton;
