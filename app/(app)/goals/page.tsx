import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/database";
import { GoalsForm } from "./GoalsForm";

export default async function GoalsPage() {
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
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-xl font-bold">Your goals</h1>
      <GoalsForm profile={profile as UserProfile} />
    </div>
  );
}
