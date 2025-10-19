import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="h-80 w-full bg-gray-100 p-15">
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
    </div>
  );
}
