"use server";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";
import { sql, and, eq } from "drizzle-orm";

export const getUniqueStates = async () => {
  const states = await db
    .selectDistinct({ state: professionalTable.state })
    .from(professionalTable)
    .where(sql`${professionalTable.state} IS NOT NULL`)
    .orderBy(professionalTable.state);

  return states.map((s) => s.state).filter(Boolean) as string[];
};

export const getUniqueCities = async (state?: string) => {
  const conditions = [sql`${professionalTable.city} IS NOT NULL`];
  
  if (state) {
    conditions.push(eq(professionalTable.state, state));
  }

  const cities = await db
    .selectDistinct({ city: professionalTable.city })
    .from(professionalTable)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(professionalTable.city);

  return cities.map((c) => c.city).filter(Boolean) as string[];
};

export const getUniqueHealthPlans = async () => {
  const professionals = await db
    .select({ agreements: professionalTable.agreements })
    .from(professionalTable)
    .where(sql`${professionalTable.agreements} IS NOT NULL`);

  const plansSet = new Set<string>();

  for (const prof of professionals) {
    if (prof.agreements) {
      try {
        const agreements = JSON.parse(prof.agreements);
        if (Array.isArray(agreements)) {
          agreements.forEach((plan: string) => {
            if (plan && plan.trim()) {
              plansSet.add(plan.trim());
            }
          });
        }
      } catch {
        // Ignora JSON inválido
      }
    }
  }

  return Array.from(plansSet).sort();
};

