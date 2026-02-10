"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    passwordConfirmation: z.string().min(8, "Confirme a senha"),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

type ResetPasswordFormProps = {
  token: string | null;
};

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", passwordConfirmation: "" },
  });

  if (errorParam === "INVALID_TOKEN" || !token) {
    return (
      <Card className="w-full border border-gray-200 shadow-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Link inválido ou expirado</CardTitle>
          <CardDescription>
            O link de redefinição de senha não é válido ou já expirou. Solicite
            um novo link na página &quot;Esqueci a senha&quot;.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/authentication/forgot-password"
            className="inline-block text-sm font-medium text-gray-800 underline hover:text-gray-600"
          >
            Solicitar novo link
          </Link>
        </CardContent>
      </Card>
    );
  }

  async function onSubmit(values: FormValues) {
    const { data, error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      toast.error(error.message ?? "Erro ao redefinir senha.");
      return;
    }
    toast.success("Senha alterada com sucesso.");
    router.push("/authentication");
  }

  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl">Redefinir senha</CardTitle>
        <CardDescription>Digite e confirme sua nova senha.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Redefinir senha
              </Button>
              <Link
                href="/authentication"
                className="text-center text-sm text-gray-600 underline hover:text-gray-900"
              >
                Voltar ao login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
