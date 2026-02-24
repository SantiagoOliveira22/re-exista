"use server";

import { db } from "@/db";
import { faqTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { count } from "drizzle-orm";

interface CreateFaqInput {
  question: string;
  answer: string;
}

export const createFaq = async (input: CreateFaqInput) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Não autorizado.");
  }

  const [result] = await db.select({ total: count() }).from(faqTable);
  const nextOrder = result.total;

  await db.insert(faqTable).values({
    question: input.question.trim(),
    answer: input.answer.trim(),
    displayOrder: nextOrder,
  });
};
