import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/login/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Today" },
  { href: "/log", label: "Log" },
  { href: "/history", label: "History" },
  { href: "/goals", label: "Goals" },
  { href: "/settings", label: "Settings" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <span className="text-lg font-extrabold tracking-tight">
          macro<span className="gradient-text">mates</span>
        </span>
        <form action={signOut}>
          <button type="submit" className="text-sm text-muted hover:text-foreground">
            Sign out
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-6 pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-white/5 bg-surface/95 px-2 py-3 backdrop-blur">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-1 text-sm font-medium text-muted transition hover:scale-105 hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
