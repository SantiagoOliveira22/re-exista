"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const deleteProfessional = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  const [existing] = await db
    .select()
    .from(professionalTable)
    .where(eq(professionalTable.id, id))
    .limit(1);

  if (!existing) {
    throw new Error("Profissional não encontrado!");
  }

  await db
    .delete(professionalTable)
    .where(eq(professionalTable.id, id));
};
