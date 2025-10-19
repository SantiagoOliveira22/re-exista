"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

function Header() {
  return (
    <header
      className="flex items-center justify-between p-5"
      style={{
        background: "linear-gradient(90deg, #4671FE 0%, #CE66FF 100%)",
      }}
    >
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="logo da página - re-exista"
          width={100}
          height={26.14}
        />
      </Link>

      <nav className="flex items-center space-x-20 pr-12">
        <Link
          href="/"
          className="text-white transition-colors hover:text-gray-200"
        >
          Home
        </Link>
        <Link
          href="/profissionais"
          className="text-white transition-colors hover:text-gray-200"
        >
          Profissionais
        </Link>
        <Link
          href="/perguntas-frequentes"
          className="text-white transition-colors hover:text-gray-200"
        >
          Perguntas Frequentes
        </Link>
        <Link
          href="/contato"
          className="text-white transition-colors hover:text-gray-200"
        >
          Contato
        </Link>
      </nav>
    </header>
  );
}

export default Header;
