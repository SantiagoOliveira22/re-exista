import ForgotPasswordForm from "../components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-[400px]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
