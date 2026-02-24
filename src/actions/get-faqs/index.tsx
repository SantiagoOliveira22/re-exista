"use server";

import { db } from "@/db";
import { faqTable } from "@/db/schema";
import { asc } from "drizzle-orm";

export const getFaqs = async () => {
  const faqs = await db
    .select()
    .from(faqTable)
    .orderBy(asc(faqTable.displayOrder), asc(faqTable.createdAt));

  return faqs;
};
