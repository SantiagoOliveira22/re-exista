"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  HandHeart,
  UserPlus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getContactMessages } from "@/actions/get-contact-messages";
import { updateContactMessageStatus } from "@/actions/update-contact-message-status";
import { approveContactMessage } from "@/actions/approve-contact-message";

type ContactMessage = {
  id: string;
  type: string;
  status: string;
  senderName: string;
  senderEmail: string;
  subject: string | null;
  message: string | null;
  professionalName: string | null;
  professionalCategory: string | null;
  professionalCity: string | null;
  professionalState: string | null;
  professionalPhone: string | null;
  professionalEmail: string | null;
  professionalSpecialty: string | null;
  professionalFormat: string | null;
  professionalDescription: string | null;
  createdAt: Date;
};

const TYPE_LABELS: Record<string, string> = {
  contact: "Contato",
  suggest: "Indicação",
  self_indicate: "Auto-indicação",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Reprovado",
  read: "Lida",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  read: "bg-gray-100 text-gray-600",
};

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "contact":
      return <MessageSquare className="h-4 w-4" />;
    case "suggest":
      return <HandHeart className="h-4 w-4" />;
    case "self_indicate":
      return <UserPlus className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
}

function MessageCard({
  msg,
  onRefresh,
}: {
  msg: ContactMessage;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveContactMessage(msg.id);
      toast.success("Profissional aprovado e adicionado à plataforma!");
      onRefresh();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erro ao aprovar.";
      toast.error(errorMsg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await updateContactMessageStatus(msg.id, "rejected");
      toast.success("Mensagem reprovada.");
      onRefresh();
    } catch {
      toast.error("Erro ao reprovar.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleMarkRead = async () => {
    setIsMarkingRead(true);
    try {
      await updateContactMessageStatus(msg.id, "read");
      toast.success("Marcada como lida.");
      onRefresh();
    } catch {
      toast.error("Erro ao marcar como lida.");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const isProfessionalType = msg.type === "suggest" || msg.type === "self_indicate";
  const isPending = msg.status === "pending";

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center gap-3 p-4 text-left"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <TypeIcon type={msg.type} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{msg.senderName}</span>
            <span
              className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[msg.status] || ""}`}
            >
              {STATUS_LABELS[msg.status] || msg.status}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {TYPE_LABELS[msg.type] || msg.type}
            {msg.subject && ` — ${msg.subject}`}
            {isProfessionalType && msg.professionalName && ` — ${msg.professionalName}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {new Date(msg.createdAt).toLocaleDateString("pt-BR")}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <span className="font-medium text-gray-500">Email:</span>{" "}
                <a href={`mailto:${msg.senderEmail}`} className="text-primary hover:underline">
                  {msg.senderEmail}
                </a>
              </div>
              <div>
                <span className="font-medium text-gray-500">Data:</span>{" "}
                {new Date(msg.createdAt).toLocaleString("pt-BR")}
              </div>
            </div>

            {msg.message && (
              <div>
                <span className="font-medium text-gray-500">Mensagem:</span>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-gray-700">
                  {msg.message}
                </p>
              </div>
            )}

            {isProfessionalType && (
              <div className="rounded-md border bg-blue-50 p-3">
                <p className="mb-2 text-sm font-semibold text-blue-800">
                  Dados do Profissional
                </p>
                <div className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
                  {msg.professionalName && (
                    <div>
                      <span className="font-medium text-gray-500">Nome:</span>{" "}
                      {msg.professionalName}
                    </div>
                  )}
                  {msg.professionalCategory && (
                    <div>
                      <span className="font-medium text-gray-500">Categoria:</span>{" "}
                      {msg.professionalCategory}
                    </div>
                  )}
                  {msg.professionalSpecialty && (
                    <div>
                      <span className="font-medium text-gray-500">Especialidade:</span>{" "}
                      {msg.professionalSpecialty}
                    </div>
                  )}
                  {msg.professionalCity && (
                    <div>
                      <span className="font-medium text-gray-500">Cidade:</span>{" "}
                      {msg.professionalCity}
                      {msg.professionalState && ` - ${msg.professionalState}`}
                    </div>
                  )}
                  {msg.professionalPhone && (
                    <div>
                      <span className="font-medium text-gray-500">Telefone:</span>{" "}
                      {msg.professionalPhone}
                    </div>
                  )}
                  {msg.professionalEmail && (
                    <div>
                      <span className="font-medium text-gray-500">Email:</span>{" "}
                      {msg.professionalEmail}
                    </div>
                  )}
                  {msg.professionalFormat && (
                    <div>
                      <span className="font-medium text-gray-500">Formato:</span>{" "}
                      {msg.professionalFormat}
                    </div>
                  )}
                </div>
                {msg.professionalDescription && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-500">Descrição:</span>
                    <p className="mt-1 text-gray-700">{msg.professionalDescription}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {isPending && (
            <div className="mt-4 flex flex-wrap gap-2">
              {isProfessionalType && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      className="cursor-pointer gap-1.5 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Aprovar profissional</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ao aprovar,{" "}
                        <span className="font-semibold text-foreground">
                          {msg.professionalName}
                        </span>{" "}
                        será adicionado à lista de profissionais na categoria{" "}
                        <span className="font-semibold text-foreground">
                          {msg.professionalCategory || "Outros Serviços"}
                        </span>
                        . Deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isApproving}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isApproving && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirmar aprovação
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer gap-1.5 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Reprovar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reprovar mensagem</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deseja reprovar esta solicitação? O profissional não será
                      adicionado à plataforma.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRejecting}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReject}
                      disabled={isRejecting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isRejecting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar reprovação
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {msg.type === "contact" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer gap-1.5"
                  onClick={handleMarkRead}
                  disabled={isMarkingRead}
                >
                  {isMarkingRead ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  Marcar como lida
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getContactMessages({
        type: typeFilter,
        status: statusFilter,
      });
      setMessages(data);
    } catch {
      toast.error("Erro ao carregar mensagens.");
    } finally {
      setIsLoading(false);
    }
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const pendingCount = messages.filter((m) => m.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="contact">Contato</SelectItem>
              <SelectItem value="suggest">Indicação</SelectItem>
              <SelectItem value="self_indicate">Auto-indicação</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Reprovados</SelectItem>
              <SelectItem value="read">Lidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pendingCount > 0 && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            {pendingCount} pendente{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-lg border bg-gray-50 py-12 text-center">
          <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Nenhuma mensagem encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageCard key={msg.id} msg={msg} onRefresh={loadMessages} />
          ))}
        </div>
      )}
    </div>
  );
}
