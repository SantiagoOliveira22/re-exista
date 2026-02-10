import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            // Em produção: integrar com Resend, Nodemailer, etc.
            if (process.env.NODE_ENV === "development") {
                console.log("[DEV] Link para redefinir senha:", url);
            }
            // void sendEmail({ to: user.email, subject: "Redefinir senha", text: `Acesse: ${url}` });
        },
    }, 
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    user: {
        modelName: "userTable",
    },
    session: {
        modelName: "sessionTable",
    },
    account: {
        modelName: "accountTable",
    }
});