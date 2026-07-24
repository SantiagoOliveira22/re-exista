import { db } from '@/db';
import { professionalTable } from '@/db/schema';
import { count, eq, and, sql, ilike, asc } from 'drizzle-orm';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { Filters } from './_components/filters';
import { SearchBar } from './_components/search-bar';
import { ProfessionalCard } from './_components/professional-card';
import { AdminCreateButton } from './_components/admin-create-button';
import { AdminExportButton } from './_components/admin-export-button';
import { AdminMoveButton } from './_components/admin-move-button';
import { getCategories } from '@/actions/get-categories';
import { getUniqueStates, getUniqueCities, getUniqueHealthPlans } from '@/actions/get-filter-data';
import { isAdminAuthenticated } from '@/lib/is-admin';

export const dynamic = 'force-dynamic';

const ITEMS_PER_PAGE = 6;

function FiltersFallback() {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="mb-6 h-5 w-16 animate-pulse rounded bg-gray-200" />
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-10 animate-pulse rounded-md bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchBarFallback() {
  return (
    <div className="h-10 w-full animate-pulse rounded-lg border border-muted bg-gray-100" />
  );
}

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
  const isAdmin = await isAdminAuthenticated();
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
      ilike(professionalTable.name, searchTerm)
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Buscar profissionais com filtros e paginação
  const professionals = await db
    .select()
    .from(professionalTable)
    .where(whereClause)
    .orderBy(asc(professionalTable.name))
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
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Encontre indicações de confiança
        </h1>
        <p className="text-base text-muted-foreground mb-6">
          Filtre por Estado, Planos de Saúde, Cidade e muito mais<br />
          Profissionais indicados por pessoas da comunidade LGBTQIAPN+
        </p>
      
        {/* Layout: Sidebar à esquerda e conteúdo principal à direita */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de Filtros */}
          <aside className="w-full lg:w-80 flex-shrink-0 bg-gray-100 p-4 rounded-lg">
            <Suspense fallback={<FiltersFallback />}>
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
            </Suspense>
          </aside>

          {/* Área Principal: Busca + Profissionais */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Barra de busca + Botão admin */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex-1">
                <Suspense fallback={<SearchBarFallback />}>
                  <SearchBar />
                </Suspense>
              </div>
              <div className="flex flex-shrink-0 flex-wrap gap-2">
                <AdminExportButton isAdmin={isAdmin} />
                <AdminMoveButton isAdmin={isAdmin} />
                <AdminCreateButton isAdmin={isAdmin} />
              </div>
            </div>
            {/* Professional Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.length === 0 && (
              <span className="col-span-full text-muted-foreground text-center text-sm mt-8">
                Nenhum profissional encontrado.
              </span>
            )}
            {professionals.map(
              (professional: typeof professionalTable.$inferSelect) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  isAdmin={isAdmin}
                />
              )
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

