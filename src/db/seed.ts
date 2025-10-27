import crypto from "crypto";

import { db } from ".";
import { categoryTable, professionalTable } from "./schema";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

const categories = [
  {
    name: "Barbearia",
  },
  {
    name: "Consultoria Financeira",
  },
  {
    name: "Saúde",
  },
];

const professionals = [
  {
    categoryName: "Saúde",
    name: "Maria",
    pronoun: "ela/dela",
    specialty: "Psicóloga",
    city: "Centro/SP",
    agreements: ["Bradesco Saúde", "Sulamérica", "Amil"],
    description: "Especialista em Saúde Mental",
  },
  {
    categoryName: "Barbearia",
    name: "Santiago",
    pronoun: "ele/dele",
    specialty: "Cortes Masculinos",
    city: "Francisco Morato/SP",
    agreements: ["Bradesco Saúde", "Sulamérica", "Amil"],
    description: "Especialista em Cortes Masculinos",
  },
  {
    categoryName: "Consultoria Financeira",
    name: "Gui Casagrande",
    pronoun: "elu/delu",
    specialty: "Saúde Financeira",
    city: "Faria Lima/SP",
    agreements: ["Bradesco Saúde", "Sulamérica", "Amil"],
    description: "Especialista em Saúde Financeira",
  },
];

async function main() {
  console.log("🌱 Iniciando o seeding do banco de dados...");

  try {
    //Limpar dados existentes
    console.log("🧹 Limpando dados existentes...");
    await db.delete(professionalTable);
    await db.delete(categoryTable);
    console.log("✅ Dados limpos com sucesso!");

    // Inserir categorias primeiro
    const categoryMap = new Map<string, string>();

    console.log("📂 Criando categorias...");
    for (const categoryData of categories) {
      const categoryId = crypto.randomUUID();
      const categorySlug = generateSlug(categoryData.name);

      console.log(`  📁 Criando categoria: ${categoryData.name}`);

      await db.insert(categoryTable).values({
        id: categoryId,
        name: categoryData.name,
        slug: categorySlug,
      });

      categoryMap.set(categoryData.name, categoryId);
    }

    // Inserir profissionais
    for (const professionalData of professionals) {
      const professionalId = crypto.randomUUID();
      const professionalSlug = generateSlug(professionalData.name);
      const categoryId = categoryMap.get(professionalData.categoryName);

      if (!categoryId) {
        throw new Error(
          `Categoria "${professionalData.categoryName}" não encontrada`,
        );
      }

      console.log(`👤 Criando profissional: ${professionalData.name}`);

      await db.insert(professionalTable).values({
        id: professionalId,
        name: professionalData.name,
        slug: professionalSlug,
        pronoun: professionalData.pronoun,
        specialty: professionalData.specialty,
        city: professionalData.city,
        agreements: JSON.stringify(professionalData.agreements),
        description: professionalData.description,
        categoryId: categoryId,
      });
    }

    console.log("✅ Seeding concluído com sucesso!");
    console.log(
      `📊 Foram criadas ${categories.length} categorias e ${
        professionals.length
      } profissionais.`,
    );
  } catch (error) {
    console.error("❌ Erro durante o seeding:", error);
    throw error;
  }
}

main().catch(console.error);
