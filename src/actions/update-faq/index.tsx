"use server";

import { db } from "@/db";
import { faqTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

interface UpdateFaqInput {
  id: string;
  question: string;
  answer: string;
}

export const updateFaq = async (input: UpdateFaqInput) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  await db
    .update(faqTable)
    .set({
      question: input.question.trim(),
      answer: input.answer.trim(),
    })
    .where(eq(faqTable.id, input.id));
};
