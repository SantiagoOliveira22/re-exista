"use server";

import { db } from "@/db";
import { contactMessageTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { desc, eq, and } from "drizzle-orm";

export const getContactMessages = async (filters?: {
  type?: string;
  status?: string;
}) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const conditions = [];

  if (filters?.type && filters.type !== "all") {
    conditions.push(eq(contactMessageTable.type, filters.type));
  }
  if (filters?.status && filters.status !== "all") {
    conditions.push(eq(contactMessageTable.status, filters.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const messages = await db
    .select()
    .from(contactMessageTable)
    .where(whereClause)
    .orderBy(desc(contactMessageTable.createdAt));

  return messages;
};
