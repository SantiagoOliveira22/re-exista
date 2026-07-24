"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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

  const buildProfessionalListUrl = (params: URLSearchParams) => {
    const queryString = params.toString();
    return queryString ? `/professionalList?${queryString}` : "/professionalList";
  };

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

    router.push(buildProfessionalListUrl(params));
    router.refresh();
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

    router.push(buildProfessionalListUrl(params));
    router.refresh();
  };

  const clearFilters = () => {
    router.push("/professionalList");
    router.refresh();
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedState ||
    selectedCity ||
    selectedHealthPlan ||
    onlineOnly;

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-foreground">Filtros</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
            >
              Limpar
            </Button>
          )}
        </div>
        <form className="flex flex-col gap-5">
          {/* Área de Atuação */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Área de Atuação
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-100 border-0 rounded-md px-3 py-2.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Ex: Endocrinologista, Psicóloga, etc.
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Estado
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-100 border-0 rounded-md px-3 py-2.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Ex: RS, SP, RJ, etc.
            </p>
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cidade
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-100 border-0 rounded-md px-3 py-2.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Ex: Porto Alegre, Goiânia, São José, etc.
            </p>
          </div>

          {/* Planos de Saúde */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Plano de Saúde
            </label>
            <div className="relative">
              <select
                className="w-full bg-gray-100 border-0 rounded-md px-3 py-2.5 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Ex: Unimed, Amil, SulAmérica, Bradesco, etc.
            </p>
          </div>

          {/* Atendimento Online */}
          <div className="flex items-center justify-between mt-2">
            <label
              htmlFor="atendimento-online"
              className="text-sm font-medium text-foreground select-none cursor-pointer"
            >
              Atendimento Online
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={onlineOnly}
              onClick={() => handleOnlineToggle(!onlineOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                onlineOnly ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  onlineOnly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </form>
    </div>
  );
}

