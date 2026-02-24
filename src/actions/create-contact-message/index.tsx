"use server";

import { db } from "@/db";
import { contactMessageTable } from "@/db/schema";

interface CreateContactMessageInput {
  type: "contact" | "suggest" | "self_indicate";
  senderName: string;
  senderEmail: string;
  subject?: string;
  message?: string;
  professionalName?: string;
  professionalCategory?: string;
  professionalCity?: string;
  professionalState?: string;
  professionalPhone?: string;
  professionalEmail?: string;
  professionalSpecialty?: string;
  professionalFormat?: string;
  professionalDescription?: string;
}

export const createContactMessage = async (input: CreateContactMessageInput) => {
  await db.insert(contactMessageTable).values({
    type: input.type,
    status: "pending",
    senderName: input.senderName.trim(),
    senderEmail: input.senderEmail.trim(),
    subject: input.subject?.trim() || null,
    message: input.message?.trim() || null,
    professionalName: input.professionalName?.trim() || null,
    professionalCategory: input.professionalCategory?.trim() || null,
    professionalCity: input.professionalCity?.trim() || null,
    professionalState: input.professionalState?.trim() || null,
    professionalPhone: input.professionalPhone?.trim() || null,
    professionalEmail: input.professionalEmail?.trim() || null,
    professionalSpecialty: input.professionalSpecialty?.trim() || null,
    professionalFormat: input.professionalFormat?.trim() || null,
    professionalDescription: input.professionalDescription?.trim() || null,
  });
};
