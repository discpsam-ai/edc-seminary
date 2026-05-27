"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function StudentLoginPage() {
  const supabase = createClient();

  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    setError("");

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("student_number", studentId)
      .single();

    if (profileError || !profile?.email) {
      setError("Invalid Student ID");

      setLoading(false);

      return;
    }

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

    if (loginError) {
      setError(loginError.message);

      setLoading(false);

      return;
    }

    router.push("/portal/dashboard");

    router.refresh();

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ec] px-6 py-16">
      <section className="w-full max-w-md border border-[#c9a84c]/20 bg-white/90 p-8">
        <p className="section-label">
          Student Portal
        </p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Student Login
        </h1>

        <p className="mt-4 leading-8 text-[#1c2b3a]/70">
          Access your EDC student account using your student ID and password.
        </p>

        <form onSubmit={handleLogin} className="mt-10 grid gap-5">
          <input
            type="text"
            required
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}