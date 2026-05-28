"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AcademicSession = {
  id: string;
  session_name: string;
  current_semester: string | null;
  admissions_open: boolean;
  registration_open: boolean;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
};

export default function AdminSessionsPage() {
  const supabase = createClient();

  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [semester, setSemester] = useState("Semester 1");
  const [loading, setLoading] = useState(false);

  async function loadSessions() {
    const { data, error } = await supabase
      .from("academic_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setSessions(data);
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function createSession() {
    if (!sessionName.trim()) {
      alert("Enter session name, e.g. 2025/2026");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("academic_sessions").insert({
      session_name: sessionName.trim(),
      current_semester: semester,
      admissions_open: false,
      registration_open: false,
      is_active: false,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSessionName("");
    setSemester("Semester 1");
    loadSessions();
  }

  async function makeActive(id: string) {
    setLoading(true);

    await supabase
      .from("academic_sessions")
      .update({ is_active: false })
      .neq("id", id);

    const { error } = await supabase
      .from("academic_sessions")
      .update({ is_active: true })
      .eq("id", id);

    setLoading(false);

    if (error) alert(error.message);
    loadSessions();
  }

  async function toggleField(
    id: string,
    field: "admissions_open" | "registration_open",
    value: boolean
  ) {
    setLoading(true);

    const { error } = await supabase
      .from("academic_sessions")
      .update({ [field]: !value })
      .eq("id", id);

    setLoading(false);

    if (error) alert(error.message);
    loadSessions();
  }

  async function updateSemester(id: string, value: string) {
    const { error } = await supabase
      .from("academic_sessions")
      .update({ current_semester: value })
      .eq("id", id);

    if (error) alert(error.message);
    loadSessions();
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-6 text-[#2d2414]">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Academic Session Management</h1>
          <p className="mt-2 text-sm text-[#6f6042]">
            Create sessions, open admissions, control registration, and set the
            active academic session.
          </p>
        </div>

        <section className="rounded-2xl border border-[#c9a84c]/30 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Create New Session</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <input
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g. 2025/2026"
              className="rounded-xl border border-[#c9a84c]/30 bg-[#fdfaf4] p-3 outline-none"
            />

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="rounded-xl border border-[#c9a84c]/30 bg-[#fdfaf4] p-3 outline-none"
            >
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>

            <button
              onClick={createSession}
              disabled={loading}
              className="rounded-xl bg-[#2d2414] px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create Session"}
            </button>
          </div>
        </section>

        <section className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-[#c9a84c]/30 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-xl font-bold">
                    {session.session_name}
                    {session.is_active && (
                      <span className="ml-3 rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                        Active
                      </span>
                    )}
                  </h3>

                  <p className="mt-1 text-sm text-[#6f6042]">
                    Current Semester: {session.current_semester || "Not set"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => makeActive(session.id)}
                    className="rounded-xl border border-[#2d2414] px-4 py-2 text-sm font-semibold"
                  >
                    Set Active
                  </button>

                  <button
                    onClick={() =>
                      toggleField(
                        session.id,
                        "admissions_open",
                        session.admissions_open
                      )
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      session.admissions_open
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Admissions {session.admissions_open ? "Open" : "Closed"}
                  </button>

                  <button
                    onClick={() =>
                      toggleField(
                        session.id,
                        "registration_open",
                        session.registration_open
                      )
                    }
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                      session.registration_open
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Registration{" "}
                    {session.registration_open ? "Open" : "Closed"}
                  </button>
                </div>
              </div>

              <div className="mt-4 max-w-xs">
                <label className="mb-1 block text-sm font-medium">
                  Current Semester
                </label>

                <select
                  value={session.current_semester || "Semester 1"}
                  onChange={(e) => updateSemester(session.id, e.target.value)}
                  className="w-full rounded-xl border border-[#c9a84c]/30 bg-[#fdfaf4] p-3 outline-none"
                >
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                </select>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#c9a84c]/40 bg-white p-8 text-center text-[#6f6042]">
              No academic session created yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}