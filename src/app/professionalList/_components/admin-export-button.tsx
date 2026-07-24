"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AdminExportButtonProps {
  isAdmin: boolean;
}

export function AdminExportButton({ isAdmin }: AdminExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!isAdmin) return null;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch("/api/professionals/export");

      if (!response.ok) {
        throw new Error("Erro ao exportar profissionais");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename =
        filenameMatch?.[1] ??
        `profissionais-re-exista-${new Date().toISOString().slice(0, 10)}.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Planilha exportada com sucesso!");
    } catch {
      toast.error("Erro ao exportar profissionais.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="h-full cursor-pointer gap-2 whitespace-nowrap"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Exportar Excel
    </Button>
  );
}
