"use client";

import { db } from "@/db";
import { professionalTable } from "@/db/schema";

interface ProfessionalListProps {
    professionals: (typeof professionalTable.$inferSelect
)[];
}

const ProfessionalList = async () => { const Professional = ({ professionals }: ProfessionalListProps)

}

const professionals = await db.query.professionalTable.findMany({});
console.log(professionals);