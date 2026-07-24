"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteCategory = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  const [existing] = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.id, id))
    .limit(1);

  if (!existing) {
    throw new Error("Categoria não encontrada!");
  }

  await db.delete(categoryTable).where(eq(categoryTable.id, id));

  revalidatePath("/", "layout");
  revalidatePath("/outras-categorias");
  revalidatePath("/professionalList");
};
