import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="gradient-hero flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="pop-in text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Set a new <span className="gradient-text">password</span>
        </h1>
        <p className="mt-2 text-muted">
          Pick something you&apos;ll actually remember this time. 😉
        </p>
      </div>
      <ResetPasswordForm />
    </main>
  );
}
