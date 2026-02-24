"use server";

import { db } from "@/db";
import { contactMessageTable, professionalTable, categoryTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

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

export const approveContactMessage = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const [message] = await db
    .select()
    .from(contactMessageTable)
    .where(eq(contactMessageTable.id, id))
    .limit(1);

  if (!message) {
    throw new Error("Mensagem não encontrada.");
  }

  if (message.type === "contact") {
    throw new Error("Mensagens de contato não podem ser aprovadas como profissional.");
  }

  if (!message.professionalName || !message.professionalCity) {
    throw new Error("Dados do profissional incompletos para aprovação.");
  }

  const categoryName = message.professionalCategory || "Outros Serviços";
  const [category] = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.name, categoryName))
    .limit(1);

  if (!category) {
    throw new Error(`Categoria "${categoryName}" não encontrada. Crie a categoria antes de aprovar.`);
  }

  let slug = generateSlug(message.professionalName);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existing = await db
      .select()
      .from(professionalTable)
      .where(eq(professionalTable.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      isUnique = true;
    } else {
      slug = `${generateSlug(message.professionalName!)}-${counter}`;
      counter++;
    }
  }

  await db.insert(professionalTable).values({
    userId: session.user.id,
    categoryId: category.id,
    name: message.professionalName,
    slug,
    city: message.professionalCity,
    state: message.professionalState || null,
    specialty: message.professionalSpecialty || null,
    contactPhone: message.professionalPhone || null,
    contactEmail: message.professionalEmail || null,
    format: message.professionalFormat || null,
    description: message.professionalDescription || null,
  });

  await db
    .update(contactMessageTable)
    .set({ status: "approved" })
    .where(eq(contactMessageTable.id, id));
};
