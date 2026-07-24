import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { generateAdminAccessToken } from "@/lib/admin-access";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const adminAccessKey = process.env.ADMIN_ACCESS_KEY;

  // Se a variável ADMIN_ACCESS_KEY não estiver configurada, bloqueia tudo por segurança
  if (!adminAccessKey) {
    if (
      pathname.startsWith("/authentication") ||
      pathname.startsWith("/api/auth/sign-up")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ============================================================
  // 1. PROTEÇÃO DA PÁGINA DE AUTENTICAÇÃO
  //    Só é acessível com ?key=ADMIN_ACCESS_KEY na URL
  //    ou com o cookie admin_access válido.
  //    EXCEÇÃO: rotas públicas do fluxo de recuperação de senha
  // ============================================================
  const isPasswordRecoveryRoute =
    pathname.startsWith("/authentication/reset-password") ||
    pathname.startsWith("/authentication/forgot-password");

  if (pathname.startsWith("/authentication") && !isPasswordRecoveryRoute) {
    const keyParam = searchParams.get("key");
    const adminCookie = request.cookies.get("admin_access")?.value;
    const expectedToken = generateAdminAccessToken(adminAccessKey!);

    // Se a chave correta está na URL, seta o cookie e redireciona sem a chave
    // (para não ficar exposta na barra de endereço / histórico)
    if (keyParam === adminAccessKey) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("key");
      const response = NextResponse.redirect(url);
      response.cookies.set("admin_access", expectedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hora
        path: "/",
      });
      return response;
    }

    // Se o cookie válido existe, permite acesso
    if (adminCookie && adminCookie === expectedToken) {
      return NextResponse.next();
    }

    // Caso contrário, redireciona para a home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ============================================================
  // 2. PROTEÇÃO DA API DE SIGN-UP
  //    Impede que alguém crie contas chamando a API diretamente.
  //    Só funciona se o cookie admin_access estiver presente.
  // ============================================================
  if (pathname.startsWith("/api/auth/sign-up")) {
    const adminCookie = request.cookies.get("admin_access")?.value;
    const expectedToken = generateAdminAccessToken(adminAccessKey!);

    if (!adminCookie || adminCookie !== expectedToken) {
      return NextResponse.json(
        { error: "Acesso não autorizado" },
        { status: 403 },
      );
    }
  }

  // ============================================================
  // 3. PROTEÇÃO DAS ROTAS ADMIN (protected)
  //    Exige sessão válida (cookie do better-auth).
  // ============================================================
  if (
    pathname.startsWith("/professional-form") ||
    pathname.startsWith("/admin")
  ) {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/authentication/:path*",
    "/api/auth/sign-up/:path*",
    "/professional-form/:path*",
    "/admin/:path*",
  ],
};
