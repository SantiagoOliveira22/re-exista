"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { inArray } from "drizzle-orm";

export const moveProfessionals = async (
  professionalIds: string[],
  targetCategoryId: string,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  if (professionalIds.length === 0) {
    throw new Error("Selecione ao menos um profissional!");
  }

  await db
    .update(professionalTable)
    .set({ categoryId: targetCategoryId })
    .where(inArray(professionalTable.id, professionalIds));
};
