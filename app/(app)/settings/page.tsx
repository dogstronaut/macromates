import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
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
    <div className="flex flex-col items-center gap-6 pt-12 text-center">
      <h1 className="text-xl font-extrabold">Settings</h1>
      <div className="w-full max-w-sm rounded-2xl bg-surface p-5 text-left text-sm">
        <p className="text-muted">Name</p>
        <p className="mb-3 font-medium">{profile.name}</p>
        <p className="text-muted">Household code (share with your mate)</p>
        <p className="break-all font-mono text-xs">{profile.household_id}</p>
      </div>
      <p className="max-w-xs text-sm text-muted">
        Nudges and notifications are coming soon — for now, hold each other
        accountable the old-fashioned way. 😏
      </p>
    </div>
  );
}
