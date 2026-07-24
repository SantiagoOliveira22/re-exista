"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/require-admin";
import { saveCategoryIcon } from "@/lib/save-category-icon";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const createCategory = async (formData: FormData) => {
  await requireAdmin();

  const name = formData.get("name") as string;
  const iconFile = formData.get("icon") as File | null;

  if (!name || !name.trim()) {
    throw new Error("Nome da categoria é obrigatório!");
  }

  let slug = generateSlug(name);
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const existing = await db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      isUnique = true;
    } else {
      slug = `${generateSlug(name)}-${counter}`;
      counter++;
    }
  }

  let iconUrl: string | null = null;

  if (iconFile && iconFile.size > 0) {
    iconUrl = await saveCategoryIcon(iconFile, slug);
  }

  await db.insert(categoryTable).values({
    name: name.trim(),
    slug,
    iconUrl,
  });

  revalidatePath("/", "layout");
  revalidatePath("/outras-categorias");
};
