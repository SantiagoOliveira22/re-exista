"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {Button} from "..//ui/Button";
import { authClient } from "@/lib/auth-client";
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import {Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,} from "../ui/sheet";

function Header() {
  const {data: session} = authClient.useSession()
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

        <div className="flex items-center">
          <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>  
          </SheetTrigger>  
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button size="icon" asChild variant="outline">
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Header;
