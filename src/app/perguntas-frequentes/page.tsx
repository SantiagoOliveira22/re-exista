import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: "1",
    question: "Como surgiu a re-exista?",
    answer:
      "A re-exista surgiu da necessidade de criar um espaço seguro e confiável para a comunidade LGBTQIAP+ encontrar profissionais e empresas que oferecem serviços de qualidade e com respeito à diversidade. Nosso objetivo é facilitar o acesso a indicações confiáveis, criando uma rede de apoio e suporte para pessoas que buscam serviços em diversas áreas.",
  },
  {
    id: "2",
    question: "Como posso indicar um profissional/empresa?",
    answer:
      "Para indicar um profissional ou empresa, você pode acessar a área de indicações em nosso site e preencher o formulário com as informações do profissional ou empresa que deseja recomendar. Todas as indicações passam por um processo de verificação para garantir a qualidade e confiabilidade das recomendações.",
  },
  {
    id: "3",
    question: "Quero ser uma empresa/profissional indicado! O que faço?",
    answer:
      "Se você é um profissional ou empresa que deseja fazer parte da nossa plataforma, entre em contato conosco através da página de contato. Nossa equipe irá avaliar seu perfil e, se atender aos nossos critérios de qualidade e compromisso com a diversidade, você poderá ser incluído em nossa base de indicações.",
  },
  {
    id: "4",
    question:
      "Tive problema no atendimento de uma pessoa profissional/empresa indicado pela re-exista. O que faço?",
    answer:
      "Lamentamos muito que você tenha tido uma experiência negativa. Por favor, entre em contato conosco imediatamente através da página de contato, relatando o ocorrido. Nossa equipe irá investigar a situação e tomar as medidas necessárias, podendo inclusive remover o profissional ou empresa de nossa plataforma caso seja confirmado o problema.",
  },
  {
    id: "5",
    question: "Eu agendo consulta/faço a contratação pela re-exista?",
    answer:
      "Não, a re-exista é uma plataforma de indicação. Nós apenas conectamos pessoas que buscam serviços com profissionais e empresas indicados pela comunidade. O agendamento de consultas e a contratação de serviços devem ser feitos diretamente com o profissional ou empresa, através dos contatos fornecidos em seus perfis.",
  },
  {
    id: "6",
    question: "Eu preciso pagar algo?",
    answer:
      "Não, a re-exista é totalmente gratuita para quem busca profissionais e empresas. Nossa plataforma é um serviço comunitário que visa facilitar o acesso a indicações confiáveis sem custos para os usuários.",
  },
];

export default function PerguntasFrequentes() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 pb-20 sm:pb-24 md:pb-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#9333EA" }}>
            Perguntas Frequentes
          </h1>
          <p className="text-gray-600 text-base">
            Encontre respostas para as principais dúvidas sobre a re-exista
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <Accordion type="single" collapsible defaultValue="1" className="w-full">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border-b border-gray-200 last:border-b-0 data-[state=open]:border-[#5DC9FF] data-[state=open]:border-2 data-[state=open]:rounded-md data-[state=open]:p-4 data-[state=open]:mb-2 data-[state=open]:-mx-4 data-[state=open]:md:-mx-6"
              >
                <AccordionTrigger className="text-left font-bold text-base text-black hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-black text-sm leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            Não encontrou a pergunta ou resposta que estava procurando?
          </p>
          <Link
            href="/contato"
            className="font-bold text-lg hover:underline inline-block"
            style={{ color: "#9333EA" }}
          >
            Entre em contato
          </Link>
        </div>
      </div>
    </div>
  );
}

