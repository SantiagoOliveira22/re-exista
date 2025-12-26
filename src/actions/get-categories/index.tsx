"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export const getCategories = async () => {
  const categories = await db.select().from(categoryTable);
  return categories;
};

