"use server";

import { db } from "@/db";
import { faqTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const deleteFaq = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  await db.delete(faqTable).where(eq(faqTable.id, id));
};
