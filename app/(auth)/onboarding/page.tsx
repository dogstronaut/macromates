import { OnboardingForm } from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="gradient-hero flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="pop-in max-w-sm text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Set up your <span className="gradient-text">household</span>
        </h1>
        <p className="mt-2 text-muted">
          One of you starts it, the other joins with the code — then the
          friendly competition begins.
        </p>
      </div>

      <div className="pop-in w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-5 text-left text-sm">
        <p className="font-bold text-accent-lime">What&apos;s MacroMates? 👋</p>
        <p className="mt-2 text-muted">
          It&apos;s the fastest way for two people to keep each other honest
          on calories and protein. Log meals in seconds, watch your rings
          fill up side by side, and see who&apos;s crushing it today.
        </p>
      </div>

      <OnboardingForm />
    </main>
  );
}
