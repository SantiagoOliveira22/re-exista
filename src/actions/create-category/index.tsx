"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  const name = formData.get("name") as string;
  const iconFile = formData.get("icon") as File | null;

  if (!name || !name.trim()) {
    throw new Error("Nome da categoria é obrigatório!");
  }

  // Gerar slug único
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

  // Salvar ícone se fornecido
  let iconUrl: string | null = null;

  if (iconFile && iconFile.size > 0) {
    const bytes = await iconFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Criar pasta icons se não existir
    const iconsDir = path.join(process.cwd(), "public", "icons");
    await mkdir(iconsDir, { recursive: true });

    // Gerar nome único para o arquivo
    const ext = iconFile.name.split(".").pop() || "svg";
    const fileName = `${slug}-${Date.now()}.${ext}`;
    const filePath = path.join(iconsDir, fileName);

    await writeFile(filePath, buffer);
    iconUrl = `/icons/${fileName}`;
  }

  // Criar categoria
  await db.insert(categoryTable).values({
    name: name.trim(),
    slug,
    iconUrl,
  });
};
