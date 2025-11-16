"use client";

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
    name: z.string().trim().min(1, "Nome é obrigatório!"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres!"),
    passwordConfirmation: z.string().min(8, "Senha deve ter no mínimo 8 caracteres!")
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem!",
    path: ["passwordConfirmation"],
});

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        }
    });

    async function onSubmit(values: FormValues) {
        try {
            const { data, error } = await authClient.signUp.email({
                name: values.name,
                email: values.email,
                password: values.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Conta criada com sucesso");
                    },
                    onError: (error) => {
                        toast.error(error.error.message);
                    },
                },
            });
        } catch (error) {
            toast.error("Erro ao criar conta");
        }
    } 

    return (
        <>
            <Card className="w-80">
                <CardHeader>
                    <CardTitle>Criar Conta</CardTitle>
                    <CardDescription>Preencha os dados abaixo</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Seu nome" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>E-mail</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="seu@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
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
                                        <FormLabel>Confirmar Senha</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Criar Conta
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}; 
 
export default SignUpForm;