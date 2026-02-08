import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/actions/get-categories";

export default async function Home() {
  // Buscar categorias para obter os IDs das categorias
  const categories = await getCategories();
  const barbeariaCategory = categories.find(cat => cat.name === "Barbearia");
  const consultoriaFinanceiraCategory = categories.find(cat => cat.name === "Consultoria Financeira");
  const saudeCategory = categories.find(cat => cat.name === "Saúde");
  const outrosServicosCategory = categories.find(cat => cat.name === "Outros Serviços");
  
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
          <p className="mb-6 text-lg font-semibold sm:mb-8 sm:text-xl md:text-2xl lg:mb-10">Principais Categorias</p>
          <div className="flex flex-wrap justify-center gap-4 bg-white p-4 sm:justify-around sm:gap-6 sm:p-6 md:gap-8 md:p-8 lg:p-16">
            <Link
              href={barbeariaCategory ? `/professionalList?category=${barbeariaCategory.id}` : "/professionalList"}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-violet-400 p-3 text-center text-[10px] transition-colors hover:border-violet-800 sm:h-28 sm:w-28 sm:p-4 sm:text-xs md:h-32 md:w-32 md:text-sm lg:h-[100px] lg:w-32"
            >
              <Image
                src="/barber.svg"
                alt="ícone de barbearia"
                width={40}
                height={40}
                className="mx-auto h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              />
              <p className="mt-2">Barbearia</p>
            </Link>

            <Link
              href={consultoriaFinanceiraCategory ? `/professionalList?category=${consultoriaFinanceiraCategory.id}` : "/professionalList"}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-violet-400 p-3 text-center text-[10px] transition-colors hover:border-violet-800 sm:h-28 sm:w-28 sm:p-4 sm:text-xs md:h-32 md:w-32 md:text-sm lg:h-[100px] lg:w-32"
            >
              <Image
                src="/financial.svg"
                alt="Ícone consultoria financeira"
                width={40}
                height={40}
                className="mx-auto h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              />
              <p className="mt-1">
                Consultoria <br className="hidden sm:block" /> Financeira
              </p>
            </Link>

            <Link
              href={saudeCategory ? `/professionalList?category=${saudeCategory.id}` : "/professionalList"}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-violet-400 p-3 text-center text-[10px] transition-colors hover:border-violet-800 sm:h-28 sm:w-28 sm:p-4 sm:text-xs md:h-32 md:w-32 md:text-sm lg:h-[100px] lg:w-32"
            >
              <Image
                src="/health.svg"
                alt="ícone Saúde"
                width={40}
                height={40}
                className="mx-auto h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              />
              <p className="mt-2">Saúde</p>
            </Link>

            <Link
              href={outrosServicosCategory ? `/professionalList?category=${outrosServicosCategory.id}` : "/professionalList"}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-violet-400 p-3 text-center text-[10px] transition-colors hover:border-violet-800 sm:h-28 sm:w-28 sm:p-4 sm:text-xs md:h-32 md:w-32 md:text-sm lg:h-[100px] lg:w-32"
            >
              <Image
                src="/services.svg"
                alt="Ícone Outros Serviços"
                width={40}
                height={40}
                className="mx-auto h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
              />
              <p className="mt-2">Outros Serviços</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
