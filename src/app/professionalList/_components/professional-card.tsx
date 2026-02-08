"use client";

import { ProfessionalDetails } from "./professional-details";
import { MapPin, MessageCircle, Shield, Phone, Mail } from "lucide-react";
import { professionalTable } from "@/db/schema";

interface ProfessionalCardProps {
  professional: typeof professionalTable.$inferSelect;
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
  // Gera as iniciais (primeiro nome e primeiro sobrenome) de forma padronizada
  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase() || '';
    }
    return (
      (parts[0][0]?.toUpperCase() || '') +
      (parts[1][0]?.toUpperCase() || '')
    );
  };

  // Pega o título (Dr/Dra) + primeiro nome + segundo nome para exibir no card
  const getFirstName = (name?: string | null) => {
    if (!name) return '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '';
    
    // Verifica se começa com título (Dr, Dra, Dr., Dra.)
    const firstPart = parts[0].toLowerCase();
    const isTitle = firstPart === 'dr' || firstPart === 'dra' || 
                    firstPart === 'dr.' || firstPart === 'dra.';
    
    if (isTitle && parts.length > 2) {
      // Retorna título + primeiro nome + segundo nome (ex: "Dr Santiago Oliveira")
      return `${parts[0]} ${parts[1]} ${parts[2]}`;
    } else if (isTitle && parts.length > 1) {
      // Se tiver apenas título + primeiro nome
      return `${parts[0]} ${parts[1]}`;
    } else if (parts.length > 1) {
      // Retorna primeiro nome + segundo nome (ex: "João Silva")
      return `${parts[0]} ${parts[1]}`;
    }
    
    // Caso contrário, retorna apenas o primeiro nome
    return parts[0];
  };

  return (
    <div className="bg-white rounded-lg border border-muted p-4 flex flex-col gap-3 shadow-sm h-full">
      <div className="flex items-center gap-3">
        {/* Círculo de iniciais sempre do mesmo tamanho, centralizado e com fonte adequada */}
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center font-bold text-primary text-lg border-2 border-primary select-none flex-shrink-0">
          {getInitials(professional.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <span className="font-semibold text-base text-foreground">
              {getFirstName(professional.name)}...
            </span>
            {professional.pronoun && (
              <span className="text-xs bg-accent text-foreground px-2 py-0.5 rounded font-medium mt-1 w-fit">
                {professional.pronoun.toLowerCase()}
              </span>
            )}
          </div>
          {professional.specialty && (
            <span className="inline-block text-xs text-white px-2 py-0.5 rounded-full mt-1" style={{ backgroundColor: '#5DC9FF' }}>
              {professional.specialty}
            </span>
          )}
        </div>
      </div>
      
      {!!professional.city && !!professional.state && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 text-red-500" />
          <span>{professional.city}/{professional.state}</span>
        </div>
      )}
      
      {/* Formato de Atendimento */}
      {professional.format && (
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#EF9B00' }} strokeWidth={2} />
          <span className="text-xs text-white px-3 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: '#EF9B00' }}>
            {professional.format}
          </span>
        </div>
      )}
      
      {/* Planos de Saúde */}
      {(() => {
        if (!professional.agreements) return null;
        try {
          const agreementsArray = JSON.parse(professional.agreements);
          if (
            Array.isArray(agreementsArray) &&
            agreementsArray.length > 0
          ) {
            const displayedPlans = agreementsArray.slice(0, 2);
            const hasMorePlans = agreementsArray.length > 2;
            
            return (
              <div className="flex items-center gap-2 flex-wrap">
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#008F1C' }} strokeWidth={2} />
                {displayedPlans.map((agreement: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs text-white px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ backgroundColor: '#008F1C' }}
                  >
                    {agreement}
                  </span>
                ))}
                {hasMorePlans && (
                  <span className="text-xs text-muted-foreground">
                    ...
                  </span>
                )}
              </div>
            );
          }
        } catch {
          // Se não for JSON válido, não mostra nada
        }
        return null;
      })()}
      
      {professional.description && (
        <div className="text-xs text-muted-foreground line-clamp-1">
          {professional.description}
        </div>
      )}
      
      {/* Contato */}
      {(professional.contactPhone || professional.contactEmail) && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {professional.contactPhone ? (
            <>
              <Phone className="w-3 h-3" />
              <span>{professional.contactPhone}</span>
            </>
          ) : professional.contactEmail ? (
            <>
              <Mail className="w-3 h-3" />
              <span>{professional.contactEmail}</span>
            </>
          ) : null}
        </div>
      )}
      
      <div className="mt-auto">
        <ProfessionalDetails professional={professional}>
          <button className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors w-full">
            Ver Detalhes
          </button>
        </ProfessionalDetails>
      </div>
    </div>
  );
}

