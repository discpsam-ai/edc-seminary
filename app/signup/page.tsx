"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const supabase = createClient();

  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
     toast.error(error.message);
      return;
    }

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: fullName,
          email: email,
          role: "student",
          level: "Level 1",
        });

      if (profileError) {
       toast.error(profileError.message);
        return;
      }
    }

    toast.success("Account created successfully");

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ec] px-6">
      <div className="w-full max-w-md border border-[#c9a84c]/20 bg-white p-10">
        <div className="text-center">
          <p className="section-label">EDC Portal</p>

          <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Create Account
          </h1>

          <p className="mt-4 leading-8 text-[#1c2b3a]/70">
            Register into Ecclesia Discipleship & Commissioning.
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-10 grid gap-5">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

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
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}