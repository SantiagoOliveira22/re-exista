"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

export const deleteProfessional = async (id: string) => {
  await requireAdmin();

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

  revalidatePath("/professionalList");
};
