"use client";

import { useState } from "react";
import { Loader2, MessageSquare, UserPlus, HandHeart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createContactMessage } from "@/actions/create-contact-message";

type Category = { id: string; name: string };

interface ContactFormsProps {
  categories: Category[];
}

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.senderName.trim() || !form.senderEmail.trim() || !form.message.trim()) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        type: "contact",
        senderName: form.senderName,
        senderEmail: form.senderEmail,
        subject: form.subject,
        message: form.message,
      });
      toast.success("Mensagem enviada com sucesso! Obrigado pelo contato.");
      setForm({ senderName: "", senderEmail: "", subject: "", message: "" });
    } catch {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Seu nome *</label>
          <Input
            placeholder="Digite seu nome"
            value={form.senderName}
            onChange={(e) => setForm({ ...form, senderName: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Seu email *</label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={form.senderEmail}
            onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Assunto</label>
        <Input
          placeholder="Sobre o que deseja falar?"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Mensagem *</label>
        <Textarea
          placeholder="Escreva sua mensagem..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          disabled={isSubmitting}
          className="min-h-[120px]"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enviar mensagem
      </Button>
    </form>
  );
}

function SuggestForm({ categories }: { categories: Category[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    professionalName: "",
    professionalCategory: "",
    professionalCity: "",
    professionalState: "",
    professionalPhone: "",
    professionalEmail: "",
    professionalSpecialty: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.senderName.trim() ||
      !form.senderEmail.trim() ||
      !form.professionalName.trim() ||
      !form.professionalCity.trim()
    ) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        type: "suggest",
        senderName: form.senderName,
        senderEmail: form.senderEmail,
        message: form.message,
        professionalName: form.professionalName,
        professionalCategory: form.professionalCategory,
        professionalCity: form.professionalCity,
        professionalState: form.professionalState,
        professionalPhone: form.professionalPhone,
        professionalEmail: form.professionalEmail,
        professionalSpecialty: form.professionalSpecialty,
      });
      toast.success("Indicação enviada com sucesso! Nossa equipe irá avaliar.");
      setForm({
        senderName: "",
        senderEmail: "",
        professionalName: "",
        professionalCategory: "",
        professionalCity: "",
        professionalState: "",
        professionalPhone: "",
        professionalEmail: "",
        professionalSpecialty: "",
        message: "",
      });
    } catch {
      toast.error("Erro ao enviar indicação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Conhece um profissional que merece estar na re-exista? Preencha os dados abaixo.
      </p>

      <div className="rounded-lg border bg-gray-50 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-700">Seus dados</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Seu nome *</label>
            <Input
              placeholder="Digite seu nome"
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Seu email *</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={form.senderEmail}
              onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-gray-50 p-4">
        <p className="mb-3 text-sm font-semibold text-gray-700">Dados do profissional</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do profissional *</label>
              <Input
                placeholder="Nome completo"
                value={form.professionalName}
                onChange={(e) => setForm({ ...form, professionalName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={form.professionalCategory}
                onValueChange={(val) => setForm({ ...form, professionalCategory: val })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Especialidade</label>
              <Input
                placeholder="Ex: Psicologia, Barbearia"
                value={form.professionalSpecialty}
                onChange={(e) => setForm({ ...form, professionalSpecialty: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input
                placeholder="(00) 00000-0000"
                value={form.professionalPhone}
                onChange={(e) => setForm({ ...form, professionalPhone: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade *</label>
              <Input
                placeholder="Cidade"
                value={form.professionalCity}
                onChange={(e) => setForm({ ...form, professionalCity: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Input
                placeholder="Ex: RS, SP"
                value={form.professionalState}
                onChange={(e) => setForm({ ...form, professionalState: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email do profissional</label>
            <Input
              type="email"
              placeholder="profissional@email.com"
              value={form.professionalEmail}
              onChange={(e) => setForm({ ...form, professionalEmail: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Por que você indica este profissional?</label>
        <Textarea
          placeholder="Conte sua experiência com este profissional..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          disabled={isSubmitting}
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enviar indicação
      </Button>
    </form>
  );
}

function SelfIndicateForm({ categories }: { categories: Category[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    senderName: "",
    senderEmail: "",
    professionalCategory: "",
    professionalCity: "",
    professionalState: "",
    professionalPhone: "",
    professionalSpecialty: "",
    professionalFormat: "",
    professionalDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.senderName.trim() ||
      !form.senderEmail.trim() ||
      !form.professionalCity.trim()
    ) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        type: "self_indicate",
        senderName: form.senderName,
        senderEmail: form.senderEmail,
        professionalName: form.senderName,
        professionalCategory: form.professionalCategory,
        professionalCity: form.professionalCity,
        professionalState: form.professionalState,
        professionalPhone: form.professionalPhone,
        professionalEmail: form.senderEmail,
        professionalSpecialty: form.professionalSpecialty,
        professionalFormat: form.professionalFormat,
        professionalDescription: form.professionalDescription,
      });
      toast.success("Solicitação enviada com sucesso! Nossa equipe irá avaliar seu perfil.");
      setForm({
        senderName: "",
        senderEmail: "",
        professionalCategory: "",
        professionalCity: "",
        professionalState: "",
        professionalPhone: "",
        professionalSpecialty: "",
        professionalFormat: "",
        professionalDescription: "",
      });
    } catch {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Você é um profissional e deseja fazer parte da re-exista? Preencha seus dados abaixo.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Seu nome *</label>
          <Input
            placeholder="Nome completo"
            value={form.senderName}
            onChange={(e) => setForm({ ...form, senderName: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Seu email *</label>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={form.senderEmail}
            onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={form.professionalCategory}
            onValueChange={(val) => setForm({ ...form, professionalCategory: val })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Especialidade</label>
          <Input
            placeholder="Ex: Psicologia, Barbearia"
            value={form.professionalSpecialty}
            onChange={(e) => setForm({ ...form, professionalSpecialty: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cidade *</label>
          <Input
            placeholder="Cidade"
            value={form.professionalCity}
            onChange={(e) => setForm({ ...form, professionalCity: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Input
            placeholder="Ex: RS, SP"
            value={form.professionalState}
            onChange={(e) => setForm({ ...form, professionalState: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Telefone</label>
          <Input
            placeholder="(00) 00000-0000"
            value={form.professionalPhone}
            onChange={(e) => setForm({ ...form, professionalPhone: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Formato de atendimento</label>
          <Select
            value={form.professionalFormat}
            onValueChange={(val) => setForm({ ...form, professionalFormat: val })}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Presencial">Presencial</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Híbrido">Híbrido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descreva seu serviço</label>
        <Textarea
          placeholder="Conte sobre você, seu trabalho e por que deseja fazer parte da re-exista..."
          value={form.professionalDescription}
          onChange={(e) => setForm({ ...form, professionalDescription: e.target.value })}
          disabled={isSubmitting}
          className="min-h-[120px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enviar solicitação
      </Button>
    </form>
  );
}

export function ContactForms({ categories }: ContactFormsProps) {
  return (
    <Tabs defaultValue="contact" className="w-full">
      <TabsList className="mb-6 grid h-auto w-full grid-cols-3 gap-1">
        <TabsTrigger value="contact" className="cursor-pointer gap-1.5 py-2.5 text-xs sm:text-sm">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Dúvida / Contato</span>
          <span className="sm:hidden">Contato</span>
        </TabsTrigger>
        <TabsTrigger value="suggest" className="cursor-pointer gap-1.5 py-2.5 text-xs sm:text-sm">
          <HandHeart className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Indicar Profissional</span>
          <span className="sm:hidden">Indicar</span>
        </TabsTrigger>
        <TabsTrigger value="self_indicate" className="cursor-pointer gap-1.5 py-2.5 text-xs sm:text-sm">
          <UserPlus className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Quero ser Indicado</span>
          <span className="sm:hidden">Ser Indicado</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contact">
        <ContactForm />
      </TabsContent>

      <TabsContent value="suggest">
        <SuggestForm categories={categories} />
      </TabsContent>

      <TabsContent value="self_indicate">
        <SelfIndicateForm categories={categories} />
      </TabsContent>
    </Tabs>
  );
}
