"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const updateCategory = async (formData: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

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

  // Se enviou novo ícone, salva e atualiza
  if (iconFile && iconFile.size > 0) {
    const bytes = await iconFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const iconsDir = path.join(process.cwd(), "public", "icons");
    await mkdir(iconsDir, { recursive: true });

    const ext = iconFile.name.split(".").pop() || "svg";
    const fileName = `${existing.slug}-${Date.now()}.${ext}`;
    const filePath = path.join(iconsDir, fileName);

    await writeFile(filePath, buffer);
    iconUrl = `/icons/${fileName}`;
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
};
