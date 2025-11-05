import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

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
      <div className="flex h-50 w-full flex-shrink-0 justify-around gap-5 bg-white p-15">
      <p className="rounded-lg border-2 p-4 border-violet-400 transition-colors hover:border-violet-800">
      <Link href="/">
        <Image
          src="/barber.svg"
          alt="logo da página - re-exista"
          width={40}
          height={10}
        />
      </Link>
      </p>
      <p className="rounded-lg border-2 p-4 border-violet-400 transition-colors hover:border-violet-800">
      <Link href="/">
        <Image
          src="/financial.svg"
          alt="logo da página - re-exista"
          width={40}
          height={10}
        />
      </Link>
      </p>
      <p className="rounded-lg border-2 p-4 border-violet-400 transition-colors hover:border-violet-800">
      <Link href="/">
        <Image
          src="/medical-team.svg"
          alt="logo da página - re-exista"
          width={40}
          height={10}
        />
      </Link>
      </p>
      <p className="rounded-lg border-2 p-4 border-violet-400 transition-colors hover:border-violet-800">
      <Link href="/">
        <Image
          src="/tattoo-studio.svg"
          alt="logo da página - re-exista"
          width={40}
          height={10}
        />
      </Link>
      </p>
      <p className="rounded-lg border-2 p-4 border-violet-400 transition-colors hover:border-violet-800">
      <Link href="/">
        <Image
          src="/application.svg"
          alt="logo da página - re-exista"
          width={40}
          height={10}
        />
      </Link>
      </p>
        
       
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
