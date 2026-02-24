"use server";

import { db } from "@/db";
import { contactMessageTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export const updateContactMessageStatus = async (
  id: string,
  status: "read" | "rejected",
) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  await db
    .update(contactMessageTable)
    .set({ status })
    .where(eq(contactMessageTable.id, id));
};
