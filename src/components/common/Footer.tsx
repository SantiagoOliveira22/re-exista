import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/actions/get-categories";

async function Footer() {
  const currentYear = new Date().getFullYear();
  const categories = await getCategories();
  
  // Buscar IDs das categorias principais
  const barbeariaCategory = categories.find(cat => cat.name === "Barbearia");
  const consultoriaFinanceiraCategory = categories.find(cat => cat.name === "Consultoria Financeira");
  const saudeCategory = categories.find(cat => cat.name === "Saúde");
  const outrosServicosCategory = categories.find(cat => cat.name === "Outros Serviços");

  return (
    <footer className="w-full border-t-2 border-gray-300 bg-gray-100 text-gray-800 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 xl:gap-x-8">
          {/* Sobre */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold sm:text-base">Re-exista</h3>
            <p className="text-xs leading-relaxed text-gray-700 sm:text-sm md:text-base">
              Somos um Portal de Indicação pensado na comunidade e pessoas que
              buscam profissionais e empresas de qualquer área com quem possam
              se sentir à vontade.
            </p>
            <div className="flex gap-3">
              <Link
                href="/"
                className="transition-opacity hover:opacity-70"
                aria-label="Instagram"
              >
                <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  width={35}
                  height={20}
                  className="h-5 w-auto sm:h-6"
                />
              </Link>
              <Link
                href="/"
                className="transition-opacity hover:opacity-70"
                aria-label="LinkedIn"
              >
                <Image
                  src="/linkedin.svg"
                  alt="LinkedIn"
                  width={35}
                  height={20}
                  className="h-5 w-auto sm:h-6"
                />
              </Link>
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-2 lg:ml-8 xl:ml-10">
            <h3 className="text-sm font-semibold sm:text-base">Categorias</h3>
            <ul className="space-y-1 pl-2 text-xs sm:text-sm">
              <li>
                <Link
                  href={barbeariaCategory ? `/professionalList?category=${barbeariaCategory.id}` : "/professionalList"}
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Barbearia
                </Link>
              </li>
              <li>
                <Link
                  href={consultoriaFinanceiraCategory ? `/professionalList?category=${consultoriaFinanceiraCategory.id}` : "/professionalList"}
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Consultoria Financeira
                </Link>
              </li>
              <li>
                <Link
                  href={saudeCategory ? `/professionalList?category=${saudeCategory.id}` : "/professionalList"}
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Saúde
                </Link>
              </li>
              <li>
                <Link
                  href={outrosServicosCategory ? `/professionalList?category=${outrosServicosCategory.id}` : "/professionalList"}
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Outros Serviços
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold sm:text-base">Recursos</h3>
            <ul className="space-y-1 pl-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/perguntas-frequentes"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold sm:text-base">Legal</h3>
            <ul className="space-y-1 pl-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/termos-de-uso"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divisor */}
        <hr className="my-3 border-gray-300 sm:my-4" />

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1 px-4 text-center">
          <p className="text-[10px] text-gray-600 sm:text-xs md:text-sm">
            © {currentYear} re-exista. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-gray-600 sm:text-xs md:text-sm">
            Feito com <em className="text-red-500">♥</em> por{" "}
            <Link
              href="https://wa.me/5511964771951?text=Ol%C3%A1%2C%20encontrei%20o%20seu%20contato%20no%20site%20re-exista%2C%20gostaria%20de%20um%20or%C3%A7amento!"
              target="_blank"
              rel="noopener noreferrer"
              className="break-words font-medium text-gray-800 transition-colors hover:text-gray-900 underline"
            >
              Santiago Oliveira - Desenvolvedor Web / Programador
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
