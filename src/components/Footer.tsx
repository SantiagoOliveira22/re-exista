"use client"

import React from "react";
import { Instagram, Linkedin } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";


function Footer() {

  const currentYear = new Date().getFullYear(

  )
  return (
    <div className="w-full bg-gray-100 px-10 py-6 text-gray-800">
      <div className="flex justify-between">
        <div>
          <p className="text-[12px]">Re-exista</p>
          <p className="text-[10px]">
            Somos um Portal de Indicação pensado na comunidade e <br /> pessoas
            que buscam profissionais e empresas de qualquer área <br /> com quem
            possam se sentir à vontade.
          </p>
          <div className="flex gap-2">
            
      <Link  href="/" className="mt-2">
        <Image
          src="/instagram.svg"
          alt="instagram"
          width={35}
          height={20}
        />
      </Link>
      <Link  href="/" className="mt-2">
        <Image
          src="/linkedin.svg"
          alt="linkedin"
          width={35}
          height={20}
        />
      </Link>
          </div>
        </div>

        <div className="text-[12px]">
          <p>Categorias</p>
        </div>

        <div className="text-[12px]">
          <p>Recursos</p>
          <p>Perguntas Frequentes</p>
        </div>

        <div className="text-[12px]">
          <p>Legal</p>
          <p>Termos de Uso</p>
          <p>Política de Privacidade</p>
          <p>Contato</p>
        </div>
      </div>
      <hr />
      <div className="flex-collunm text-center">
        <p className="text-[12px]">
           © {currentYear} re-exista. Todos os diretiros reservados.
        </p>
        <Link  href="/" className="mt-2">
        <p className="text-[12px]">
          Feito com <em className="text-red-500">♥</em> por Santiago Oliveira
        </p>
      </Link>

      </div>
    </div>
  );
}

export default Footer;
