import { Suspense } from "react";
import ResetPasswordForm from "../components/reset-password-form";

type PageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token ?? null;

  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-[400px]">
        <Suspense fallback={<div className="text-sm text-gray-500">Carregando...</div>}>
          <ResetPasswordForm token={token} />
        </Suspense>
      </div>
    </div>
  );
}
