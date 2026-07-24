import { db } from "@/db";
import { categoryTable, professionalTable } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/is-admin";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

function formatAgreements(agreements: string | null): string {
  if (!agreements) return "";

  try {
    const parsed = JSON.parse(agreements);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).join(", ");
    }
  } catch {
    return agreements;
  }

  return agreements;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

export async function GET() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 });
  }

  try {
    const professionals = await db
      .select({
        name: professionalTable.name,
        category: categoryTable.name,
        pronoun: professionalTable.pronoun,
        specialty: professionalTable.specialty,
        address: professionalTable.address,
        city: professionalTable.city,
        state: professionalTable.state,
        format: professionalTable.format,
        contactPhone: professionalTable.contactPhone,
        contactEmail: professionalTable.contactEmail,
        agreements: professionalTable.agreements,
        description: professionalTable.description,
        createdAt: professionalTable.createdAt,
      })
      .from(professionalTable)
      .innerJoin(
        categoryTable,
        eq(professionalTable.categoryId, categoryTable.id),
      )
      .orderBy(asc(professionalTable.name));

    const rows = professionals.map((professional) => ({
      Nome: professional.name,
      Categoria: professional.category,
      Pronome: professional.pronoun ?? "",
      Especialidade: professional.specialty ?? "",
      Endereço: professional.address ?? "",
      Cidade: professional.city,
      Estado: professional.state ?? "",
      Formato: professional.format ?? "",
      Telefone: professional.contactPhone ?? "",
      "E-mail": professional.contactEmail ?? "",
      "Planos de Saúde": formatAgreements(professional.agreements),
      Descrição: professional.description ?? "",
      "Data de Cadastro": formatDate(professional.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profissionais");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    const filename = `profissionais-re-exista-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao exportar profissionais:", error);
    return NextResponse.json(
      { error: "Erro ao exportar profissionais" },
      { status: 500 },
    );
  }
}
