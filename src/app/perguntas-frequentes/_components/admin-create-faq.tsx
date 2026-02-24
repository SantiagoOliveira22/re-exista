"use client";

import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { createFaq } from "@/actions/create-faq";

export function AdminCreateFaq() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (isSessionPending || !session?.user) return null;

  const resetForm = () => {
    setQuestion("");
    setAnswer("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("A pergunta é obrigatória!");
      return;
    }
    if (!answer.trim()) {
      toast.error("A resposta é obrigatória!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createFaq({ question: question.trim(), answer: answer.trim() });
      toast.success("Pergunta criada com sucesso!");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pergunta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer gap-2">
          <Plus className="h-4 w-4" />
          Nova Pergunta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Pergunta Frequente</DialogTitle>
          <DialogDescription>
            Preencha a pergunta e a resposta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pergunta *</label>
            <Input
              placeholder="Digite a pergunta"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resposta *</label>
            <Textarea
              placeholder="Digite a resposta"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar pergunta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
