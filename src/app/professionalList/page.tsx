import { db } from '@/db';
import { professionalTable } from '@/db/schema';
import { count, eq, and, sql, ilike, or } from 'drizzle-orm';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Filters } from './_components/filters';
import { SearchBar } from './_components/search-bar';
import { getCategories } from '@/actions/get-categories';
import { getUniqueStates, getUniqueCities, getUniqueHealthPlans } from '@/actions/get-filter-data';

const ITEMS_PER_PAGE = 6;

interface ProfessionalListProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    state?: string;
    city?: string;
    healthPlan?: string;
    online?: string;
    search?: string;
  }>;
}

const ProfessionalList = async ({ searchParams }: ProfessionalListProps) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Buscar dados para os filtros
  const [categories, states, healthPlans] = await Promise.all([
    getCategories(),
    getUniqueStates(),
    getUniqueHealthPlans(),
  ]);

  // Buscar cidades baseado no estado selecionado
  const cities = params.state
    ? await getUniqueCities(params.state)
    : await getUniqueCities();

  // Construir condições de filtro
  const conditions = [];

  if (params.category) {
    conditions.push(eq(professionalTable.categoryId, params.category));
  }

  if (params.state) {
    conditions.push(eq(professionalTable.state, params.state));
  }

  if (params.city) {
    conditions.push(eq(professionalTable.city, params.city));
  }

  if (params.online === 'true') {
    conditions.push(eq(professionalTable.format, 'Online'));
  }

  if (params.healthPlan) {
    // Buscar profissionais que tenham o plano de saúde no JSON de agreements
    // Verifica se o plano está presente no array JSON
    conditions.push(
      sql`${professionalTable.agreements}::text ILIKE ${`%"${params.healthPlan}"%`}`
    );
  }

  if (params.search) {
    const searchTerm = `%${params.search}%`;
    conditions.push(
      or(
        ilike(professionalTable.name, searchTerm),
        ilike(professionalTable.specialty, searchTerm),
        ilike(professionalTable.description, searchTerm),
        ilike(professionalTable.city, searchTerm)
      )!
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Buscar profissionais com filtros e paginação
  const professionals = await db
    .select()
    .from(professionalTable)
    .where(whereClause)
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  // Contar total de profissionais com filtros
  const [totalResult] = await db
    .select({ count: count(professionalTable.id) })
    .from(professionalTable)
    .where(whereClause);
  
  const totalProfessionals = totalResult.count;
  const totalPages = Math.ceil(totalProfessionals / ITEMS_PER_PAGE);

  // Construir URL base para paginação mantendo filtros
  const buildPaginationUrl = (page: number) => {
    const urlParams = new URLSearchParams();
    if (params.category) urlParams.set('category', params.category);
    if (params.state) urlParams.set('state', params.state);
    if (params.city) urlParams.set('city', params.city);
    if (params.healthPlan) urlParams.set('healthPlan', params.healthPlan);
    if (params.online) urlParams.set('online', params.online);
    if (params.search) urlParams.set('search', params.search);
    urlParams.set('page', page.toString());
    return `/professionalList?${urlParams.toString()}`;
  };

  return (
    <section className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-primary mb-1">
          Encontre indicações de confiança
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Filtre por Estado, Planos de Saúde, Cidade e muito mais<br />
          Profissionais indicades por pessoas da comunidade LGBTQIAPN+
        </p>
      
        {/* Layout: Sidebar à esquerda e conteúdo principal à direita */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de Filtros */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <Filters
              categories={categories}
              states={states}
              cities={cities}
              healthPlans={healthPlans}
              selectedCategory={params.category}
              selectedState={params.state}
              selectedCity={params.city}
              selectedHealthPlan={params.healthPlan}
              onlineOnly={params.online === 'true'}
            />
          </aside>

          {/* Área Principal: Busca + Profissionais */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Barra de busca */}
            <SearchBar />
            {/* Professional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.length === 0 && (
              <span className="col-span-full text-muted-foreground text-center text-sm mt-8">
                Nenhum profissional encontrado.
              </span>
            )}
            {professionals.map(
              (professional: typeof professionalTable.$inferSelect) => {
                // Gera as iniciais (primeiro nome e primeiro sobrenome) de forma padronizada
                const getInitials = (name?: string) => {
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
                return (
                  <div
                    key={professional.id}
                    className="bg-white rounded-lg border border-muted p-4 flex flex-col gap-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {/* Círculo de iniciais sempre do mesmo tamanho, centralizado e com fonte adequada */}
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center font-bold text-primary text-lg border-2 border-primary select-none flex-shrink-0">
                        {getInitials(professional.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-base text-foreground">
                            {professional.name}
                          </span>
                          {professional.pronoun && (
                            <span className="text-xs bg-accent text-foreground px-2 py-0.5 rounded font-medium">
                              {professional.pronoun}
                            </span>
                          )}
                        </div>
                        {professional.specialty && (
                          <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1">
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
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {professional.format && (
                        <span className="text-xs bg-background text-muted-foreground border rounded px-2 py-0.5">
                          {professional.format}
                        </span>
                      )}
                      {professional.format === 'Online' && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Online
                        </span>
                      )}
                      {(() => {
                        if (!professional.agreements) return null;
                        try {
                          const agreementsArray = JSON.parse(professional.agreements);
                          if (
                            Array.isArray(agreementsArray) &&
                            agreementsArray.length > 0
                          ) {
                            return agreementsArray.map((agreement: string, idx: number) => (
                              <span
                                key={idx}
                                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                              >
                                {agreement}
                              </span>
                            ));
                          }
                        } catch {
                          // Se não for JSON válido, não mostra nada
                        }
                        return null;
                      })()}
                    </div>
                    
                    {professional.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {professional.description}
                      </div>
                    )}
                    
                    <button className="mt-auto bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                      Ver Detalhes
                    </button>
                  </div>
                );
              }
              )}
            </div>
            
            {/* Controles de Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Link
                  href={buildPaginationUrl(currentPage - 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
                      : 'bg-background border border-muted text-foreground hover:bg-accent'
                  }`}
                  aria-disabled={currentPage === 1}
                >
                  Anterior
                </Link>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Mostrar apenas algumas páginas ao redor da atual
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Link
                          key={page}
                          href={buildPaginationUrl(page)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-background border border-muted text-foreground hover:bg-accent'
                          }`}
                        >
                          {page}
                        </Link>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Link
                  href={buildPaginationUrl(currentPage + 1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
                      : 'bg-background border border-muted text-foreground hover:bg-accent'
                  }`}
                  aria-disabled={currentPage === totalPages}
                >
                  Próxima
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalList;