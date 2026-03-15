import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendResetPasswordEmail(to: string, url: string) {
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.log("[DEV] RESEND_API_KEY não configurada. Link de redefinição:", url);
    }
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "re-exista <onboarding@resend.dev>";

  await resend.emails.send({
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
}
