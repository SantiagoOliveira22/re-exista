import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { isAdminAuthenticated } from "@/lib/is-admin";

export async function requireAdmin() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    throw new Error("Usuário não autorizado!");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  return session;
}
