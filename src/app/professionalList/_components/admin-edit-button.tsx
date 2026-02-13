"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import ProfessionalForm from "@/app/(protected)/professional-form/_components/form";
import type { ProfessionalInitialData } from "@/app/(protected)/professional-form/_components/form";

interface AdminEditButtonProps {
  professional: ProfessionalInitialData;
}

export function AdminEditButton({ professional }: AdminEditButtonProps) {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  if (isPending || !session?.user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex-1 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          onClick={(e) => e.stopPropagation()}
        >
          Editar
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Editar Profissional</DialogTitle>
          <DialogDescription>
            Atualize as informações do profissional.
          </DialogDescription>
        </DialogHeader>
        <ProfessionalForm
          initialData={professional}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
