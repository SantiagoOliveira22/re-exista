import { cookies, headers } from "next/headers";

import { auth } from "@/lib/auth";
import { isValidAdminAccessCookie } from "@/lib/admin-access";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin_access")?.value;

  if (!isValidAdminAccessCookie(adminCookie)) {
    return false;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return !!session?.user;
}
