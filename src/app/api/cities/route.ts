import { getUniqueCities } from "@/actions/get-filter-data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  if (!state) {
    return NextResponse.json(
      { error: "Estado é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const cities = await getUniqueCities(state);
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cidades" },
      { status: 500 }
    );
  }
}

