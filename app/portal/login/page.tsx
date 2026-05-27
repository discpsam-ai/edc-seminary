"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
     toast.error(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      toast.error("Login failed. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role, roles")
  .eq("id", user.id)
  .single();

    if (profileError || !profile) {
  toast.error(
  `Profile lookup failed:
Error: ${profileError?.message}
Code: ${profileError?.code}
Details: ${profileError?.details}
Hint: ${profileError?.hint}
User ID: ${user.id}`
  );
  return;
}

   router.push("/select-role");
router.refresh();
return;

router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ec] px-6">
      <div className="w-full max-w-md border border-[#c9a84c]/20 bg-white p-10">
        <div className="text-center">
          <p className="section-label">EDC Portal</p>

          <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Login
          </h1>

          <p className="mt-4 leading-8 text-[#1c2b3a]/70">
            Access the Ecclesia Discipleship & Commissioning portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 grid gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <button type="submit" className="btn-gold">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}