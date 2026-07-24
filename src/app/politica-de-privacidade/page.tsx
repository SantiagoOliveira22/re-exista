import Link from "next/link";

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-white px-4 py-12 pb-20 sm:pb-24 md:pb-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "#9333EA" }}
          >
            Política de Privacidade
          </h1>
          <p className="text-base text-gray-600">
            Última atualização: julho de 2026
          </p>
        </div>

        <div className="space-y-6 rounded-lg bg-gray-50 p-6 text-sm leading-relaxed text-gray-800 shadow-sm md:p-8 md:text-base">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              1. Introdução
            </h2>
            <p>
              A re-exista respeita a privacidade de quem utiliza nossa
              plataforma. Esta Política de Privacidade descreve, de forma
              geral, como coletamos, utilizamos e protegemos informações
              pessoais no site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              2. Dados que podemos coletar
            </h2>
            <p>Podemos coletar informações como:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>nome, e-mail e mensagens enviadas pelo formulário de contato;</li>
              <li>dados de navegação, como páginas visitadas e preferências;</li>
              <li>
                informações fornecidas por administradores e profissionais
                cadastrados na plataforma.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              3. Finalidade do uso
            </h2>
            <p>Utilizamos os dados para:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>operar e melhorar o portal de indicações;</li>
              <li>responder solicitações e mensagens de contato;</li>
              <li>gerenciar cadastros, categorias e conteúdos exibidos;</li>
              <li>cumprir obrigações legais e garantir a segurança do site.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              4. Compartilhamento de informações
            </h2>
            <p>
              Não vendemos dados pessoais. Informações podem ser compartilhadas
              apenas quando necessário para prestação do serviço, cumprimento de
              exigências legais ou proteção de direitos da plataforma e de seus
              usuários.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              5. Cookies e tecnologias similares
            </h2>
            <p>
              Podemos utilizar cookies e tecnologias semelhantes para melhorar a
              experiência de navegação, lembrar preferências e analisar o uso
              da plataforma. Você pode gerenciar cookies nas configurações do
              seu navegador.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              6. Segurança e retenção
            </h2>
            <p>
              Adotamos medidas razoáveis para proteger os dados contra acesso
              não autorizado, perda ou uso indevido. As informações são
              mantidas pelo tempo necessário para cumprir as finalidades
              descritas nesta política.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              7. Seus direitos
            </h2>
            <p>
              Nos termos da legislação aplicável, você pode solicitar
              informações, correções ou exclusão de dados pessoais, conforme
              permitido em cada caso. Para exercer esses direitos, utilize a{" "}
              <Link
                href="/contato"
                className="font-medium text-[#9333EA] hover:underline"
              >
                página de contato
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              8. Alterações nesta política
            </h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente. A
              data de atualização será revisada no topo desta página sempre que
              houver mudanças relevantes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
