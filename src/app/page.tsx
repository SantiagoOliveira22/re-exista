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


{/* Categorias */}

      <p className="mt-10 ml-20">Principais Categorias</p>
      <div className="flex h-70 w-full flex-shrink-0 justify-around bg-white p-15">
     
      <Link  href="/"
      className="flex-col justify-center align-items text-xs text-center rounded-lg border-2 p-4 w-32 h-[100px] border-violet-400 hover:border-violet-800 transition-colors">
    
        <Image
          src="/barber.svg"
          alt="ícone de barbearia"
          width={40}
          height={40}
          className="mx-auto"
        />
        <p className="mt-2">Barbearia</p>
      </Link>
  
      <Link  href="/"
      className="flex-col justify-items-center text-xs text-center rounded-lg border-2 p-4 w-32 h-[100px] border-violet-400 hover:border-violet-800 transition-colors">
        <Image
          src="/financial.svg"
          alt="Ícone consultoria financeira"
          width={40}
          height={10}
        />
        <p className="mt-1">Consultoria <br /> Financeira</p>
      </Link>
    
      <Link  href="/"
      className="flex-col justify-items-center text-xs text-center rounded-lg border-2 p-4 w-32 h-[100px] border-violet-400 hover:border-violet-800 transition-colors">
        <Image
          src="/health.svg"
          alt="ìcone Saúde"
          width={40}
          height={10}
        />
        <p className="mt-2">Saúde</p>
      </Link>
      

      <Link  href="/"
      className="flex-col justify-items-center text-xs text-center rounded-lg border-2 p-4 w-32 h-[100px] border-violet-400 hover:border-violet-800 transition-colors">
        <Image
          src="/services.svg"
          alt="Ícone Outros Serviços"
          width={40}
          height={10}
        />
        <p className="mt-2">Outros Serviços</p>
      </Link>
      
      
        
       
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
