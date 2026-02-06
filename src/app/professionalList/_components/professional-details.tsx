"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, MessageCircle, Shield, Phone, Mail } from "lucide-react";
import { useState } from "react";

interface ProfessionalDetailsProps {
  professional: {
    id: string;
    name: string | null;
    pronoun: string | null;
    specialty: string | null;
    description: string | null;
    city: string | null;
    state: string | null;
    format: string | null;
    agreements: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
  };
  children: React.ReactNode;
}

export function ProfessionalDetails({ professional, children }: ProfessionalDetailsProps) {
  const [open, setOpen] = useState(false);

  // Gera as iniciais (primeiro nome e primeiro sobrenome)
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

  // Parse dos planos de saúde
  let agreementsArray: string[] = [];
  if (professional.agreements) {
    try {
      const parsed = JSON.parse(professional.agreements);
      if (Array.isArray(parsed)) {
        agreementsArray = parsed;
      }
    } catch {
      // Se não for JSON válido, não mostra nada
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Detalhes do Profissional</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Header com Avatar e Nome */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-bold text-primary text-xl border-2 border-primary select-none flex-shrink-0">
                {getInitials(professional.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <h2 className="font-semibold text-xl text-foreground">
                    {professional.name}
                  </h2>
                  {professional.pronoun && (
                    <span className="text-xs bg-accent text-foreground px-2 py-0.5 rounded font-medium mt-1 w-fit">
                      {professional.pronoun.toLowerCase()}
                    </span>
                  )}
                </div>
                {professional.specialty && (
                  <span className="inline-block text-xs text-white px-3 py-1 rounded-full mt-2" style={{ backgroundColor: '#5DC9FF' }}>
                    {professional.specialty}
                  </span>
                )}
              </div>
            </div>

            {/* Localização */}
            {professional.city && professional.state && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{professional.city}/{professional.state}</span>
              </div>
            )}

            {/* Formato de Atendimento */}
            {professional.format && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#EF9B00' }} strokeWidth={2} />
                <span className="text-xs text-white px-3 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: '#EF9B00' }}>
                  {professional.format}
                </span>
              </div>
            )}

            {/* Planos de Saúde */}
            {agreementsArray.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#008F1C' }} strokeWidth={2} />
                  <span className="text-sm font-medium text-foreground">Planos de Saúde Aceitos:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-6">
                  {agreementsArray.map((agreement: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs text-white px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: '#008F1C' }}
                    >
                      {agreement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contatos */}
            {(professional.contactPhone || professional.contactEmail) && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Contato</h3>
                <div className="space-y-2 pl-2">
                  {professional.contactPhone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <a 
                        href={`tel:${professional.contactPhone}`}
                        className="hover:text-foreground transition-colors"
                      >
                        {professional.contactPhone}
                      </a>
                    </div>
                  )}
                  {professional.contactEmail && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <a 
                        href={`mailto:${professional.contactEmail}`}
                        className="hover:text-foreground transition-colors break-all"
                      >
                        {professional.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Descrição */}
            {professional.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Sobre o Profissional</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {professional.description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

