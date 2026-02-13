"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
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

type CreateProfessionalData = {
  name: string;
  categoryId: string;
  pronoun?: string;
  specialty?: string;
  address?: string;
  city: string;
  state?: string;
  format?: string;
  contactPhone?: string;
  contactEmail?: string;
  agreements?: string;
  description?: string;
};

export const createProfessional = async (data: CreateProfessionalData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  // Gerar slug único
  let slug = generateSlug(data.name);
  let isUnique = false;
  let counter = 1;

  while (!isUnique) {
    const existing = await db
      .select()
      .from(professionalTable)
      .where(eq(professionalTable.slug, slug))
      .limit(1);

    if (existing.length === 0) {
      isUnique = true;
    } else {
      slug = `${generateSlug(data.name)}-${counter}`;
      counter++;
    }
  }

  // Criar profissional com todos os campos
  await db.insert(professionalTable).values({
    userId: session.user.id,
    categoryId: data.categoryId,
    name: data.name,
    slug: slug,
    pronoun: data.pronoun || null,
    specialty: data.specialty || null,
    address: data.address || null,
    city: data.city,
    state: data.state || null,
    format: data.format || null,
    contactPhone: data.contactPhone || null,
    contactEmail: data.contactEmail || null,
    agreements: data.agreements || null,
    description: data.description || null,
  });

};
