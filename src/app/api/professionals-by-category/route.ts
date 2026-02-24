import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId é obrigatório" },
      { status: 400 },
    );
  }

  try {
    const professionals = await db
      .select({ id: professionalTable.id, name: professionalTable.name })
      .from(professionalTable)
      .where(eq(professionalTable.categoryId, categoryId))
      .orderBy(professionalTable.name);

    return NextResponse.json(professionals);
  } catch (error) {
    console.error("Erro ao buscar profissionais por categoria:", error);
    return NextResponse.json(
      { error: "Erro ao buscar profissionais" },
      { status: 500 },
    );
  }
}
