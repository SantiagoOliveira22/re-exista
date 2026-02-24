"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getProfessionalsByCategory = async (categoryId: string) => {
  const professionals = await db
    .select({ id: professionalTable.id, name: professionalTable.name })
    .from(professionalTable)
    .where(eq(professionalTable.categoryId, categoryId))
    .orderBy(professionalTable.name);

  return professionals;
};
