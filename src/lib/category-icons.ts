const DEFAULT_ICONS: Record<string, string> = {
  Barbearia: "/barber.svg",
  "Consultoria Financeira": "/financial.svg",
  Saúde: "/health.svg",
  "Outros Serviços": "/services.svg",
};

export function getCategoryIcon(
  name: string,
  iconUrl: string | null,
): string | null {
  return iconUrl || DEFAULT_ICONS[name] || null;
}
