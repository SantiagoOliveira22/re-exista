import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqs } from "@/actions/get-faqs";
import { AdminCreateFaq } from "./_components/admin-create-faq";
import { AdminEditFaq } from "./_components/admin-edit-faq";
import { AdminDeleteFaq } from "./_components/admin-delete-faq";

export default async function PerguntasFrequentes() {
  const faqs = await getFaqs();

  return (
    <div className="min-h-screen bg-white px-4 py-12 pb-20 sm:pb-24 md:pb-28">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "#9333EA" }}
          >
            Perguntas Frequentes
          </h1>
          <p className="text-base text-gray-600">
            Encontre respostas para as principais dúvidas sobre a re-exista
          </p>
        </div>

        {/* Admin: botão nova pergunta */}
        <div className="mb-4 flex justify-end">
          <AdminCreateFaq />
        </div>

        {/* FAQ Accordion */}
        <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow-sm md:p-8">
          {faqs.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma pergunta frequente cadastrada.
            </p>
          ) : (
            <Accordion
              type="single"
              collapsible
              defaultValue={faqs[0]?.id}
              className="w-full"
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-gray-200 last:border-b-0 data-[state=open]:mb-2 data-[state=open]:rounded-md data-[state=open]:border-2 data-[state=open]:border-[#5DC9FF] data-[state=open]:p-4 data-[state=open]:-mx-4 data-[state=open]:md:-mx-6"
                >
                  <AccordionTrigger className="py-4 text-left text-base font-bold text-black hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 text-sm leading-relaxed text-black">
                    <p>{faq.answer}</p>
                    <div className="mt-3 flex gap-2">
                      <AdminEditFaq faq={faq} />
                      <AdminDeleteFaq
                        faqId={faq.id}
                        faqQuestion={faq.question}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Footer CTA */}
        <div className="text-center">
          <p className="mb-2 text-gray-600">
            Não encontrou a pergunta ou resposta que estava procurando?
          </p>
          <Link
            href="/contato"
            className="inline-block text-lg font-bold hover:underline"
            style={{ color: "#9333EA" }}
          >
            Entre em contato
          </Link>
        </div>
      </div>
    </div>
  );
}
