import { OnboardingForm } from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Set up your household</h1>
        <p className="mt-2 text-muted">
          One of you starts it, the other joins with the code.
        </p>
      </div>
      <OnboardingForm />
    </main>
  );
}
