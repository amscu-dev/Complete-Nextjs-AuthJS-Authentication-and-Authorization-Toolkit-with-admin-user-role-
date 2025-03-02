"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

function BackButton({ href, label }: BackButtonProps) {
  return (
    <Button asChild variant="link" className="font-normal w-full" size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export default BackButton;
