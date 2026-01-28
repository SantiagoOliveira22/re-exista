"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  categories: Array<{ id: string; name: string }>;
  states: string[];
  cities: string[];
  healthPlans: string[];
  selectedCategory?: string;
  selectedState?: string;
  selectedCity?: string;
  selectedHealthPlan?: string;
  onlineOnly?: boolean;
}

export function Filters({
  categories,
  states,
  cities: initialCities,
  healthPlans,
  selectedCategory,
  selectedState,
  selectedCity,
  selectedHealthPlan,
  onlineOnly: initialOnlineOnly,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState(initialCities);
  const [onlineOnly, setOnlineOnly] = useState(
    initialOnlineOnly || searchParams.get("online") === "true"
  );

  // Buscar cidades quando o estado mudar
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const response = await fetch(
            `/api/cities?state=${encodeURIComponent(selectedState)}`
          );
          if (response.ok) {
            const data = await response.json();
            setCities(data);
          }
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      } else {
        setCities(initialCities);
      }
    };

    fetchCities();
  }, [selectedState, initialCities]);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Resetar página quando filtrar
    params.delete("page");
    
    if (value && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Se mudar estado, limpar cidade
    if (key === "state") {
      params.delete("city");
    }

    router.push(`/professionalList?${params.toString()}`);
  };

  const handleOnlineToggle = (checked: boolean) => {
    setOnlineOnly(checked);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    
    if (checked) {
      params.set("online", "true");
    } else {
      params.delete("online");
    }

    router.push(`/professionalList?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/professionalList");
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedState ||
    selectedCity ||
    selectedHealthPlan ||
    onlineOnly;

  return (
    <div className="bg-muted rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-foreground">Filtros</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs h-6 px-2"
          >
            Limpar
          </Button>
        )}
      </div>
      <form className="flex flex-col gap-4">
        {/* Área de Atuação */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Área de Atuação
          </label>
          <select
            className="w-full bg-background border border-muted rounded px-3 py-2 text-sm focus-visible:outline-primary"
            value={selectedCategory || ""}
            onChange={(e) => updateFilters("category", e.target.value)}
          >
            <option value="">Selecione uma área de atuação</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Ex: Endocrinologista, Psicólogo etc.
          </p>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Estado
          </label>
          <select
            className="w-full bg-background border border-muted rounded px-3 py-2 text-sm focus-visible:outline-primary"
            value={selectedState || ""}
            onChange={(e) => updateFilters("state", e.target.value)}
          >
            <option value="">Selecione um Estado</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Ex: RS, SP, RJ etc.
          </p>
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Cidade
          </label>
          <select
            className="w-full bg-background border border-muted rounded px-3 py-2 text-sm focus-visible:outline-primary"
            value={selectedCity || ""}
            onChange={(e) => updateFilters("city", e.target.value)}
            disabled={!selectedState}
          >
            <option value="">
              {selectedState
                ? "Selecione uma Cidade"
                : "Selecione um Estado primeiro"}
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Ex: Porto Alegre, Goiânia, São José, etc.
          </p>
        </div>

        {/* Planos de Saúde */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Plano de Saúde
          </label>
          <select
            className="w-full bg-background border border-muted rounded px-3 py-2 text-sm focus-visible:outline-primary"
            value={selectedHealthPlan || ""}
            onChange={(e) => updateFilters("healthPlan", e.target.value)}
          >
            <option value="">Selecione o Plano de Saúde</option>
            {healthPlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Ex: Unimed, Amil, SulAmérica, Bradesco, etc.
          </p>
        </div>

        {/* Atendimento Online */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            className="accent-primary rounded-sm"
            id="atendimento-online"
            checked={onlineOnly}
            onChange={(e) => handleOnlineToggle(e.target.checked)}
          />
          <label
            htmlFor="atendimento-online"
            className="text-sm text-foreground font-medium select-none"
          >
            Atendimento Online
          </label>
        </div>
      </form>
    </div>
  );
}

