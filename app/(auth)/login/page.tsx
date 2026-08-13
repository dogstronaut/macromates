import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">macromates</h1>
        <p className="mt-2 text-muted">
          Log in to see who&apos;s winning today.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
