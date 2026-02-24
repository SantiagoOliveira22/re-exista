import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await db
      .select({
        id: categoryTable.id,
        name: categoryTable.name,
        slug: categoryTable.slug,
      })
      .from(categoryTable);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 },
    );
  }
}
