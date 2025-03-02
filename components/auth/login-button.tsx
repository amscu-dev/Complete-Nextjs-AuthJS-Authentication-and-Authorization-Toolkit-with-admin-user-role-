"use client";

import { useRouter } from "next/navigation";

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
    return <div>TODO: Implement modal</div>;
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
}

export default LoginButton;
