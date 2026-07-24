"use client";

import { Plus, Upload, Loader2, ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createCategory } from "@/actions/create-category";
import Image from "next/image";

export function AdminCreateCategory() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (isSessionPending || !session?.user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setName("");
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nome da categoria é obrigatório!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (iconFile) {
        formData.append("icon", iconFile);
      }

      await createCategory(formData);
      toast.success("Categoria criada com sucesso!");
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Erro ao criar categoria.";
      toast.error(message);
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
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>
            Preencha o nome e anexe um ícone para a categoria.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome *</label>
            <Input
              placeholder="Nome da categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ícone</label>
            <div
              className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-primary hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              {iconPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={iconPreview}
                    alt="Preview do ícone"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                  <span className="text-xs text-muted-foreground">
                    {iconFile?.name}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      <Upload className="mr-1 inline h-4 w-4" />
                      Clique para anexar
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG ou JPG
                    </p>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar categoria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
