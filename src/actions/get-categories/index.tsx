"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import {
  sortCategoriesWithOutrosLast,
  splitCategoriesByPrimary,
} from "@/lib/sort-categories";

export const getCategories = async () => {
  const categories = await db.select().from(categoryTable);
  return sortCategoriesWithOutrosLast(categories);
};

export const getPrimaryCategories = async () => {
  const categories = await getCategories();
  return splitCategoriesByPrimary(categories).primary;
};

export const getSecondaryCategories = async () => {
  const categories = await getCategories();
  return splitCategoriesByPrimary(categories).secondary;
};
