import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function getUserProfile(requiredRole?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  const roles: string[] = [
    ...(profile.roles || []),
    profile.role,
  ].filter(Boolean);

  if (requiredRole && !roles.includes(requiredRole)) {
    redirect("/unauthorized");
  }

  if (
    !profile.password_changed &&
    roles.includes("student")
  ) {
    redirect("/setup-password");
  }

  return {
    user,
    profile,
    roles,
  };
}