"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

type UpdateProfessionalData = {
  id: string;
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

export const updateProfessional = async (data: UpdateProfessionalData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Usuário não autorizado!");
  }

  // Verificar se o profissional existe
  const [existing] = await db
    .select()
    .from(professionalTable)
    .where(eq(professionalTable.id, data.id))
    .limit(1);

  if (!existing) {
    throw new Error("Profissional não encontrado!");
  }

  // Atualizar profissional
  await db
    .update(professionalTable)
    .set({
      name: data.name,
      categoryId: data.categoryId,
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
    })
    .where(eq(professionalTable.id, data.id));
};
