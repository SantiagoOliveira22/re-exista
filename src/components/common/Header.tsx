"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function Header() {
  return (
    <header
      className="flex items-center justify-between gap-3 p-3 sm:p-4 md:p-5"
      style={{
        background: "linear-gradient(90deg, #4671FE 0%, #CE66FF 100%)",
      }}
    >
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo.svg"
          alt="logo da página - re-exista"
          width={100}
          height={26.14}
          className="h-auto w-20 sm:w-24 md:w-28 lg:w-[100px]"
          priority
        />
      </Link>

      {/* Navegação Desktop - visível apenas em telas grandes */}
      <nav className="hidden items-center gap-4 lg:flex lg:gap-6 xl:gap-8">
        <Link
          href="/"
          className="text-sm text-white transition-colors hover:text-gray-200 md:text-base"
        >
          Home
        </Link>
        <Link
          href="/professionalList"
          className="text-sm text-white transition-colors hover:text-gray-200 md:text-base"
        >
          Profissionais
        </Link>
        <Link
          href="/perguntas-frequentes"
          className="text-sm text-white transition-colors hover:text-gray-200 md:text-base"
        >
          Perguntas Frequentes
        </Link>
        <Link
          href="/contato"
          className="text-sm text-white transition-colors hover:text-gray-200 md:text-base"
        >
          Contato
        </Link>
      </nav>

      {/* Menu Hambúrguer - visível apenas em telas menores */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="outline"
            size="icon"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 sm:w-[400px]"
        >
          <SheetHeader
            className="border-b pb-4"
            style={{
              borderColor: "rgba(70, 113, 254, 0.15)",
            }}
          >
            <SheetTitle
              className="text-xl font-bold"
              style={{
                color: "#CE66FF",
              }}
            >
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            <SheetClose asChild>
              <Link
                href="/"
                className="group rounded-lg px-4 py-3 text-base font-medium text-gray-800 transition-all hover:bg-gradient-to-r hover:from-[#4671FE]/15 hover:to-[#CE66FF]/15 hover:shadow-sm"
              >
                <span
                  className="transition-colors group-hover:bg-gradient-to-r group-hover:from-[#4671FE] group-hover:to-[#CE66FF] group-hover:bg-clip-text group-hover:text-transparent"
                  style={{
                    background: "transparent",
                  }}
                >
                  Home
                </span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/professionalList"
                className="group rounded-lg px-4 py-3 text-base font-medium text-gray-800 transition-all hover:bg-gradient-to-r hover:from-[#4671FE]/15 hover:to-[#CE66FF]/15 hover:shadow-sm"
              >
                <span
                  className="transition-colors group-hover:bg-gradient-to-r group-hover:from-[#4671FE] group-hover:to-[#CE66FF] group-hover:bg-clip-text group-hover:text-transparent"
                  style={{
                    background: "transparent",
                  }}
                >
                  Profissionais
                </span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/perguntas-frequentes"
                className="group rounded-lg px-4 py-3 text-base font-medium text-gray-800 transition-all hover:bg-gradient-to-r hover:from-[#4671FE]/15 hover:to-[#CE66FF]/15 hover:shadow-sm"
              >
                <span
                  className="transition-colors group-hover:bg-gradient-to-r group-hover:from-[#4671FE] group-hover:to-[#CE66FF] group-hover:bg-clip-text group-hover:text-transparent"
                  style={{
                    background: "transparent",
                  }}
                >
                  Perguntas Frequentes
                </span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/contato"
                className="group rounded-lg px-4 py-3 text-base font-medium text-gray-800 transition-all hover:bg-gradient-to-r hover:from-[#4671FE]/15 hover:to-[#CE66FF]/15 hover:shadow-sm"
              >
                <span
                  className="transition-colors group-hover:bg-gradient-to-r group-hover:from-[#4671FE] group-hover:to-[#CE66FF] group-hover:bg-clip-text group-hover:text-transparent"
                  style={{
                    background: "transparent",
                  }}
                >
                  Contato
                </span>
              </Link>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default Header;
