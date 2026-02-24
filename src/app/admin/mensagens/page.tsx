import { MessagesPanel } from "./_components/messages-panel";

export default function AdminMensagens() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Painel de Mensagens
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie contatos, indicações e solicitações de profissionais.
          </p>
        </div>

        <MessagesPanel />
      </div>
    </div>
  );
}
