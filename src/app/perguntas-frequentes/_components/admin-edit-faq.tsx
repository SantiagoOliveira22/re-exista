"use client";

import { Loader2 } from "lucide-react";
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
import { updateFaq } from "@/actions/update-faq";

interface AdminEditFaqProps {
  faq: {
    id: string;
    question: string;
    answer: string;
  };
}

export function AdminEditFaq({ faq }: AdminEditFaqProps) {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (isSessionPending || !session?.user) return null;

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
      await updateFaq({
        id: faq.id,
        question: question.trim(),
        answer: answer.trim(),
      });
      toast.success("Pergunta atualizada com sucesso!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar pergunta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          setQuestion(faq.question);
          setAnswer(faq.answer);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className="cursor-pointer rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600"
          onClick={(e) => e.stopPropagation()}
        >
          Editar
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Pergunta</DialogTitle>
          <DialogDescription>
            Altere a pergunta e/ou a resposta.
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
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
