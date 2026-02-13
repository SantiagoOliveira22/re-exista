"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

export function AdminCreateButton() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  // Não mostra nada se não está logado
  if (isPending || !session?.user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-full cursor-pointer gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Novo Profissional
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Adicionar Profissional</DialogTitle>
          <DialogDescription>
            Preencha as informações do profissional para continuar.
          </DialogDescription>
        </DialogHeader>
        <ProfessionalForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
