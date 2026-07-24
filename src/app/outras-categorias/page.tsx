import Link from "next/link";
import Image from "next/image";
import { getSecondaryCategories } from "@/actions/get-categories";
import { getCategoryIcon } from "@/lib/category-icons";

export default async function OutrasCategoriasPage() {
  const categories = await getSecondaryCategories();

  return (
    <div className="min-h-screen bg-white px-4 py-12 pb-20 sm:pb-24 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "#9333EA" }}
          >
            Outras categorias
          </h1>
          <p className="text-base text-gray-600">
            Explore mais áreas de profissionais indicados pela comunidade
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-8 text-center shadow-sm">
            <p className="text-sm text-muted-foreground sm:text-base">
              Nenhuma categoria adicional cadastrada no momento.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Voltar para a home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {categories.map((category) => {
              const icon = getCategoryIcon(category.name, category.iconUrl);

              return (
                <Link
                  key={category.id}
                  href={`/professionalList?category=${category.id}`}
                  className="box-border flex min-h-28 flex-col items-center justify-center rounded-lg border-2 border-violet-400 p-4 text-center text-xs transition-colors hover:border-violet-800 sm:min-h-32 sm:text-sm"
                >
                  {icon ? (
                    <Image
                      src={icon}
                      alt={`Ícone ${category.name}`}
                      width={40}
                      height={40}
                      className="mx-auto h-8 w-8 sm:h-10 sm:w-10"
                    />
                  ) : (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 sm:h-10 sm:w-10">
                      <span className="text-base font-bold sm:text-lg">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="mt-3 font-medium">{category.name}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
