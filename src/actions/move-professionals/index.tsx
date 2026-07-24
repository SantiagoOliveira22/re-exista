"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";

export const moveProfessionals = async (
  professionalIds: string[],
  targetCategoryId: string,
) => {
  await requireAdmin();

  if (professionalIds.length === 0) {
    throw new Error("Selecione ao menos um profissional!");
  }

  await db
    .update(professionalTable)
    .set({ categoryId: targetCategoryId })
    .where(inArray(professionalTable.id, professionalIds));

  revalidatePath("/professionalList");
};
