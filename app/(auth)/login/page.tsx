import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="gradient-hero flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="pop-in text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          macro<span className="gradient-text">mates</span>
        </h1>
        <p className="mt-2 text-muted">
          Log in and see who&apos;s winning today. 🏆
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
