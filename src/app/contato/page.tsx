import { getCategories } from "@/actions/get-categories";
import { ContactForms } from "./_components/contact-forms";

export default async function Contato() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white px-4 py-12 pb-20 sm:pb-24 md:pb-28">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "#9333EA" }}
          >
            Contato
          </h1>
          <p className="text-base text-gray-600">
            Entre em contato, indique um profissional ou faça parte da nossa
            plataforma
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-6 shadow-sm md:p-8">
          <ContactForms categories={categories} />
        </div>
      </div>
    </div>
  );
}
