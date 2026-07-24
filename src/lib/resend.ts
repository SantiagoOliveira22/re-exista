import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const DEFAULT_FROM = "re-exista <onboarding@resend.dev>";

const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
]);

export const resend = apiKey ? new Resend(apiKey) : null;

function isLocalEnvironment() {
  const baseUrl = process.env.BETTER_AUTH_URL ?? "";
  return (
    process.env.NODE_ENV === "development" ||
    /localhost|127\.0\.0\.1/.test(baseUrl)
  );
}

function extractEmailAddress(from: string) {
  const bracketMatch = from.match(/<([^>]+)>/);
  if (bracketMatch?.[1]) return bracketMatch[1].trim();

  const plainMatch = from.match(/([^\s<>]+@[^\s<>]+)/);
  return plainMatch?.[1]?.trim() ?? from.trim();
}

function resolveFromEmail() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) return DEFAULT_FROM;

  const domain = extractEmailAddress(configured).split("@")[1]?.toLowerCase();
  if (domain && PUBLIC_EMAIL_DOMAINS.has(domain)) {
    console.warn(
      `[re-exista] RESEND_FROM_EMAIL usa "${domain}", que não pode ser remetente no Resend. Usando "${DEFAULT_FROM}".`,
    );
    return DEFAULT_FROM;
  }

  return configured;
}

function logResetLink(url: string, reason: string) {
  console.log(
    `\n[re-exista] Link de redefinição de senha (${reason}):\n${url}\n`,
  );
}

export async function sendResetPasswordEmail(to: string, url: string) {
  const isLocal = isLocalEnvironment();

  if (!resend) {
    logResetLink(url, "RESEND_API_KEY não configurada");
    if (!isLocal) {
      throw new Error(
        "Serviço de e-mail não configurado. Defina RESEND_API_KEY no ambiente.",
      );
    }
    return;
  }

  const from = resolveFromEmail();

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Redefinir senha - re-exista",
    html: `
      <p>Olá,</p>
      <p>Você solicitou a redefinição de senha na plataforma re-exista.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <p><a href="${url}" style="color: #9333EA; font-weight: bold;">Redefinir minha senha</a></p>
      <p>Ou copie e cole este endereço no navegador:</p>
      <p style="word-break: break-all; color: #666;">${url}</p>
      <p>Este link expira em 1 hora. Se você não solicitou essa redefinição, ignore este e-mail.</p>
      <p>— Equipe re-exista</p>
    `,
  });

  if (error) {
    const isSandboxLimit = error.message?.includes(
      "testing emails to your own email",
    );
    const shouldUseConsoleFallback = isLocal || isSandboxLimit;

    if (shouldUseConsoleFallback) {
      logResetLink(url, `falha no envio: ${error.message}`);
      return;
    }

    if (error.message?.includes("domain is not verified")) {
      throw new Error(
        "Remetente inválido. Configure RESEND_FROM_EMAIL com um domínio verificado no Resend.",
      );
    }

    throw new Error(error.message ?? "Falha ao enviar e-mail de recuperação.");
  }
}
