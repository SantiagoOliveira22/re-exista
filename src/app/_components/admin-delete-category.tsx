"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { authClient } from "@/lib/auth-client";
import { deleteCategory } from "@/actions/delete-category";

interface AdminDeleteCategoryProps {
  categoryId: string;
  categoryName: string;
}

export function AdminDeleteCategory({
  categoryId,
  categoryName,
}: AdminDeleteCategoryProps) {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  if (isSessionPending || !session?.user) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryId);
      toast.success("Categoria excluída com sucesso!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir categoria.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="flex-1 cursor-pointer rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          onClick={(e) => e.stopPropagation()}
        >
          Deletar
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-foreground">
              {categoryName}
            </span>
            ? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
