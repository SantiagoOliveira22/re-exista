type CategoryLike = {
  name: string;
  slug: string;
};

export const PRIMARY_CATEGORY_NAMES = [
  "Barbearia",
  "Consultoria Financeira",
  "Saúde",
  "Tatuagem",
  "Outros Serviços",
] as const;

export function isPrimaryCategory(category: CategoryLike) {
  return PRIMARY_CATEGORY_NAMES.includes(
    category.name as (typeof PRIMARY_CATEGORY_NAMES)[number],
  );
}

export function isOutrosServicosCategory(category: CategoryLike) {
  return (
    category.name === "Outros Serviços" ||
    category.slug.startsWith("outros-serv")
  );
}

export function sortCategoriesWithOutrosLast<T extends CategoryLike>(
  categories: T[],
): T[] {
  return [...categories].sort((a, b) => {
    const aIsOutros = isOutrosServicosCategory(a);
    const bIsOutros = isOutrosServicosCategory(b);

    if (aIsOutros && !bIsOutros) return 1;
    if (!aIsOutros && bIsOutros) return -1;

    return a.name.localeCompare(b.name, "pt-BR");
  });
}

export function splitCategoriesByPrimary<T extends CategoryLike>(
  categories: T[],
) {
  const sorted = sortCategoriesWithOutrosLast(categories);
  const primary = sorted.filter(isPrimaryCategory);
  const secondary = sorted.filter((category) => !isPrimaryCategory(category));

  return { primary, secondary };
}
