"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [isPending, startTransition] = useTransition();

  // Debounce: atualiza a URL apenas após o usuário parar de digitar por 2000ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // Resetar página ao buscar

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }

      startTransition(() => {
        router.push(`/professionalList?${params.toString()}`);
      });
    }, 2000); // Aguarda 2000ms após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [searchTerm, router, searchParams]);

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="mb-2 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="search"
        placeholder="Busca"
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-full border border-muted rounded-lg pl-10 pr-4 py-2 focus-visible:outline-primary placeholder:text-muted-foreground text-sm bg-background"
        disabled={isPending}
      />
    </div>
  );
}

