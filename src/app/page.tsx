import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="h-60 w-full flex-shrink-0 bg-gray-100 px-15 py-6">
        <h1 className="h-20 w-100 font-bold">
          Encontre profissionais de confiança
          <br />
          indicados por pessoas da comunidade{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #FE00A9 0%, #009817 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            LGBTQIAP+
          </span>
        </h1>
        <p className="h-20 w-150 text-gray-800">
          Somos um Portal de Indicação pensado na comunidade e pessoas que
          buscam
          <br />
          profissionais e empresas de qualquer área com quem possam se sentir à
          vontade.
        </p>
        <Button className="cursor-pointer">Ver profissionais</Button>
      </div>

      <p className="mt-10 ml-20">Principais Categorias</p>
      <div className="flex h-70 w-full flex-shrink-0 justify-around gap-5 bg-white p-15">
        <p className="border-radius-2 border-4 p-4">Barbearia</p>
        <p className="border-radius-2 border-4 p-4">Consultoria Financeira</p>
        <p className="border-radius-2 border-4 p-4">Saúde</p>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
