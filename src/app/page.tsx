import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategories } from "@/actions/get-categories";
import { AdminCreateCategory } from "./_components/admin-create-category";
import { CategoriesCarousel } from "./_components/categories-carousel";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Primeira Seção - Hero */}
      <div className="w-full flex-shrink-0 bg-gray-100 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Encontre profissionais de confiança
            <br className="hidden sm:block" />
            <span className="sm:inline"> indicados por pessoas da comunidade </span>
            <span
              style={{
                background: "linear-gradient(90deg, #FE00A9 0%, #009817 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LGBTQIAPN+
            </span>
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-800 sm:text-base md:text-lg lg:mb-8">
            Somos um Portal de Indicação pensado na comunidade e pessoas que
            buscam profissionais e empresas de qualquer área com quem possam se sentir à
            vontade.
          </p>
          <Link href="/professionalList">
            <Button className="cursor-pointer text-sm sm:text-base">Ver profissionais</Button>
          </Link>
        </div>
      </div>

      {/* Categorias */}
      <div className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12">
          <div className="mb-6 flex items-center justify-between sm:mb-8 lg:mb-10">
            <p className="text-lg font-semibold sm:text-xl md:text-2xl">Principais Categorias</p>
            <AdminCreateCategory />
          </div>
          <CategoriesCarousel categories={categories} />
        </div>
      </div>
    </div>
  );
}
