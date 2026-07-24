"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/require-admin";
import { saveCategoryIcon } from "@/lib/save-category-icon";

export const updateCategory = async (formData: FormData) => {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const iconFile = formData.get("icon") as File | null;
  const keepCurrentIcon = formData.get("keepCurrentIcon") === "true";

  if (!id) {
    throw new Error("ID da categoria é obrigatório!");
  }

  if (!name || !name.trim()) {
    throw new Error("Nome da categoria é obrigatório!");
  }

  const [existing] = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.id, id))
    .limit(1);

  if (!existing) {
    throw new Error("Categoria não encontrada!");
  }

  let iconUrl: string | null = existing.iconUrl;

  if (iconFile && iconFile.size > 0) {
    iconUrl = await saveCategoryIcon(iconFile, existing.slug);
  } else if (!keepCurrentIcon) {
    iconUrl = null;
  }

  await db
    .update(categoryTable)
    .set({
      name: name.trim(),
      iconUrl,
    })
    .where(eq(categoryTable.id, id));

  revalidatePath("/", "layout");
  revalidatePath("/outras-categorias");
};
