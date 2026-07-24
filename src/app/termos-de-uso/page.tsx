import Link from "next/link";

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12 pb-20 sm:pb-24 md:pb-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "#9333EA" }}
          >
            Termos de Uso
          </h1>
          <p className="text-base text-gray-600">
            Última atualização: julho de 2026
          </p>
        </div>

        <div className="space-y-6 rounded-lg bg-gray-50 p-6 text-sm leading-relaxed text-gray-800 shadow-sm md:p-8 md:text-base">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              1. Sobre a plataforma
            </h2>
            <p>
              A re-exista é um portal de indicação de profissionais e empresas
              pensado para a comunidade LGBTQIAPN+ e pessoas que buscam
              serviços com acolhimento e respeito. Ao utilizar este site, você
              concorda com estes Termos de Uso.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              2. Uso do site
            </h2>
            <p>
              O conteúdo disponibilizado tem caráter informativo e de
              indicação. Você se compromete a utilizar a plataforma de forma
              lícita, respeitosa e de acordo com estes termos, sem praticar
              atos que possam prejudicar outros usuários, profissionais
              cadastrados ou o funcionamento do serviço.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              3. Indicações e profissionais
            </h2>
            <p>
              As informações exibidas sobre profissionais e categorias são
              fornecidas para facilitar o contato entre usuários e prestadores
              de serviço. A re-exista não garante resultados específicos de
              contratação, qualidade de atendimento ou disponibilidade dos
              profissionais listados.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              4. Responsabilidades
            </h2>
            <p>
              A relação comercial ou de prestação de serviços ocorre
              diretamente entre o usuário e o profissional indicado. A
              plataforma não se responsabiliza por negociações, pagamentos,
              cancelamentos ou eventuais conflitos decorrentes dessa relação.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              5. Propriedade intelectual
            </h2>
            <p>
              Marcas, textos, layout, imagens e demais elementos do site são
              protegidos por direitos autorais e não podem ser reproduzidos sem
              autorização prévia, salvo quando permitido por lei.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              6. Alterações
            </h2>
            <p>
              Estes termos podem ser atualizados a qualquer momento. Recomendamos
              revisar esta página periodicamente. O uso continuado da plataforma
              após alterações implica concordância com a versão vigente.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              7. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre estes Termos de Uso, entre em contato
              conosco pela{" "}
              <Link
                href="/contato"
                className="font-medium text-[#9333EA] hover:underline"
              >
                página de contato
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
