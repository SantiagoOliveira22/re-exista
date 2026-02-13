"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // Resetar página ao buscar

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }

    // Se não houver parâmetros, navegar para a rota limpa
    const queryString = params.toString();
    const url = queryString 
      ? `/professionalList?${queryString}` 
      : `/professionalList`;

    startTransition(() => {
      router.push(url);
    });
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors z-10" 
        onClick={handleSearch}
      />
      <input
        type="search"
        placeholder="Busca"
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full border border-muted rounded-lg pl-10 pr-4 py-2 focus-visible:outline-primary placeholder:text-muted-foreground text-sm bg-background"
        disabled={isPending}
      />
    </div>
  );
}

