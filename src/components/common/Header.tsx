"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, MenuIcon, Inbox } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

function getInitials(name?: string | null) {
  if (!name) return "";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() || "";
  }
  return (
    (parts[0][0]?.toUpperCase() || "") +
    (parts[parts.length - 1][0]?.toUpperCase() || "")
  );
}

function UserAvatar({
  name,
  size = "md",
}: {
  name?: string | null;
  size?: "sm" | "md";
}) {
  const sizeClasses =
    size === "sm"
      ? "h-9 w-9 text-xs"
      : "h-10 w-10 text-sm";

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-white/70 bg-white/20 font-bold text-white select-none transition-all hover:border-white hover:bg-white/30 ${sizeClasses}`}
    >
      {getInitials(name)}
    </div>
  );
}

function Header() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

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

        {/* Avatar com Dropdown - Desktop */}
        {!isPending && session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50">
                <UserAvatar name={session.user.name} size="md" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#CE66FF] bg-[#CE66FF]/10 text-xs font-bold text-[#CE66FF] select-none">
                    {getInitials(session.user.name)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold leading-tight">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-tight text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer gap-2">
                <Link href="/admin/mensagens">
                  <Inbox className="h-4 w-4" />
                  Painel de Mensagens
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                variant="destructive"
                className="cursor-pointer gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>

      {/* Área do usuário + Menu Hambúrguer - visível apenas em telas menores */}
      <div className="flex items-center gap-2 lg:hidden">
        {/* Avatar com Dropdown - Mobile */}
        {!isPending && session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50">
                <UserAvatar name={session.user.name} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#CE66FF] bg-[#CE66FF]/10 text-xs font-bold text-[#CE66FF] select-none">
                    {getInitials(session.user.name)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold leading-tight">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-tight text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer gap-2">
                <Link href="/admin/mensagens">
                  <Inbox className="h-4 w-4" />
                  Painel de Mensagens
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                variant="destructive"
                className="cursor-pointer gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Sheet>
          <SheetTrigger asChild>
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

            {/* Info do usuário logado - Menu lateral */}
            {!isPending && session?.user && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#4671FE]/10 to-[#CE66FF]/10 px-4 py-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#CE66FF] bg-[#CE66FF]/10 text-sm font-bold text-[#CE66FF] select-none">
                  {getInitials(session.user.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {session.user.email}
                  </span>
                </div>
              </div>
            )}

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

              {/* Links e botões exclusivos do admin - Menu lateral */}
              {!isPending && session?.user && (
                <>
                  <SheetClose asChild>
                    <Link
                      href="/admin/mensagens"
                      className="group flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-gray-800 transition-all hover:bg-gradient-to-r hover:from-[#4671FE]/15 hover:to-[#CE66FF]/15 hover:shadow-sm"
                    >
                      <Inbox className="h-4 w-4 text-[#4671FE]" />
                      <span className="transition-colors group-hover:bg-gradient-to-r group-hover:from-[#4671FE] group-hover:to-[#CE66FF] group-hover:bg-clip-text group-hover:text-transparent">
                        Painel de Mensagens
                      </span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      onClick={handleSignOut}
                      className="group mt-2 flex cursor-pointer items-center gap-2 rounded-lg border-t border-gray-200 px-4 py-3 text-base font-medium text-red-500 transition-all hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair da conta
                    </button>
                  </SheetClose>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;
