"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SetupPasswordPage() {
  const supabase = createClient();

  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

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

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: temporaryPassword,
    });

    if (loginError) {
      setError("Invalid temporary password");

      setLoading(false);

      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);

      setLoading(false);

      return;
    }

    await supabase
      .from("profiles")
      .update({
        password_changed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setSuccess("Password setup completed successfully.");

    setLoading(false);

    setTimeout(() => {
      router.push("/student/login");
    }, 2000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ec] px-6 py-16">
      <section className="w-full max-w-md border border-[#c9a84c]/20 bg-white/90 p-8">
        <p className="section-label">EDC Student Onboarding</p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Setup Your Password
        </h1>

        <p className="mt-4 leading-8 text-[#1c2b3a]/70">
          Use your student ID and temporary password to create your permanent
          login password.
        </p>

        <form onSubmit={handleSetup} className="mt-10 grid gap-5">
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
            placeholder="Temporary Password"
            value={temporaryPassword}
            onChange={(e) => setTemporaryPassword(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <input
            type="password"
            required
            placeholder="Create New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
          >
            {loading ? "Processing..." : "Setup Password"}
          </button>
        </form>
      </section>
    </main>
  );
}