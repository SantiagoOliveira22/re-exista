"use client";

import { ArrowRightLeft, Loader2, Check } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { moveProfessionals } from "@/actions/move-professionals";

type Category = { id: string; name: string; slug: string };
type Professional = { id: string; name: string };

export function AdminMoveButton() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sourceCategoryId, setSourceCategoryId] = useState("");
  const [targetCategoryId, setTargetCategoryId] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        const data: Category[] = await res.json();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) toast.error("Erro ao carregar categorias.");
      } finally {
        if (!cancelled) setIsLoadingCategories(false);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!sourceCategoryId) {
      setProfessionals([]);
      return;
    }
    let cancelled = false;

    const loadProfessionals = async () => {
      setIsLoadingProfessionals(true);
      try {
        const res = await fetch(
          `/api/professionals-by-category?categoryId=${encodeURIComponent(sourceCategoryId)}`,
        );
        if (!res.ok) throw new Error("Erro ao buscar profissionais");
        const data: Professional[] = await res.json();
        if (!cancelled) setProfessionals(data);
      } catch {
        if (!cancelled) toast.error("Erro ao carregar profissionais.");
      } finally {
        if (!cancelled) setIsLoadingProfessionals(false);
      }
    };

    loadProfessionals();
    return () => {
      cancelled = true;
    };
  }, [sourceCategoryId]);

  const handleSourceChange = useCallback((categoryId: string) => {
    setSourceCategoryId(categoryId);
    setSelectedIds(new Set());
    setTargetCategoryId("");
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === professionals.length) {
        return new Set();
      }
      return new Set(professionals.map((p) => p.id));
    });
  }, [professionals]);

  const resetForm = useCallback(() => {
    setSourceCategoryId("");
    setTargetCategoryId("");
    setProfessionals([]);
    setSelectedIds(new Set());
  }, []);

  const handleSubmit = async () => {
    if (selectedIds.size === 0) {
      toast.error("Selecione ao menos um profissional!");
      return;
    }
    if (!targetCategoryId) {
      toast.error("Selecione a categoria de destino!");
      return;
    }
    if (targetCategoryId === sourceCategoryId) {
      toast.error("A categoria de destino deve ser diferente da origem!");
      return;
    }

    setIsSubmitting(true);
    try {
      await moveProfessionals(Array.from(selectedIds), targetCategoryId);
      const count = selectedIds.size;
      toast.success(
        `${count} profissional${count > 1 ? "is" : ""} movido${count > 1 ? "s" : ""} com sucesso!`,
      );
      resetForm();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao mover profissionais.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSessionPending || !session?.user) return null;

  const targetCategories = categories.filter(
    (c) => c.id !== sourceCategoryId,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-full cursor-pointer gap-2 whitespace-nowrap"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Mover Profissionais
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Mover Profissionais</DialogTitle>
          <DialogDescription>
            Selecione a categoria de origem, marque os profissionais e escolha a
            categoria de destino.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria de origem</label>
            <Select
              value={sourceCategoryId}
              onValueChange={handleSourceChange}
              disabled={isLoadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria de origem" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sourceCategoryId && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Profissionais ({selectedIds.size}/{professionals.length})
                </label>
                {professionals.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-xs font-medium text-primary hover:underline"
                  >
                    {selectedIds.size === professionals.length
                      ? "Desmarcar todos"
                      : "Selecionar todos"}
                  </button>
                )}
              </div>

              {isLoadingProfessionals ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : professionals.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum profissional nesta categoria.
                </p>
              ) : (
                <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border p-2">
                  {professionals.map((prof) => {
                    const isSelected = selectedIds.has(prof.id);
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => toggleSelect(prof.id)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>{prof.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {selectedIds.size > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Categoria de destino
              </label>
              <Select
                value={targetCategoryId}
                onValueChange={setTargetCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria de destino" />
                </SelectTrigger>
                <SelectContent>
                  {targetCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || selectedIds.size === 0 || !targetCategoryId
            }
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Mover {selectedIds.size > 0 ? `(${selectedIds.size})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
