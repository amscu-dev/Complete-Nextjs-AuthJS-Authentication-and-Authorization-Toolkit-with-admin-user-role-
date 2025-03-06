"use server";

import { curentRole } from "@/lib/curent-user";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await curentRole();
  if (role === UserRole.ADMIN) {
    return { success: "Allowed!" };
  }
  return { error: "Forbidden!" };
};
