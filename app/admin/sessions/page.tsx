"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AcademicSession = {
  id: string;
  session_name: string;
  admissions_open: boolean;
  registration_open: boolean;
  is_active: boolean;
};

type SessionSemester = {
  id: string;
  academic_session_id: string;
  semester_name: string;
  is_open: boolean;
};

export default function AdminSessionsPage() {
  const supabase = createClient();

  const [sessions, setSessions] = useState<AcademicSession[]>([]);
  const [semesters, setSemesters] = useState<SessionSemester[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    const { data: sessionData, error: sessionError } = await supabase
      .from("academic_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (sessionError) {
      alert(sessionError.message);
      return;
    }

    const { data: semesterData, error: semesterError } = await supabase
      .from("session_semesters")
      .select("*");

    if (semesterError) {
      alert(semesterError.message);
      return;
    }

    setSessions(sessionData || []);
    setSemesters(semesterData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createSession() {
    if (!sessionName.trim()) {
      alert("Enter session name, e.g. 2025/2026");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("academic_sessions")
      .insert({
        session_name: sessionName.trim(),
        admissions_open: false,
        registration_open: false,
        is_active: false,
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const { error: semesterInsertError } = await supabase
      .from("session_semesters")
      .insert([
        {
          academic_session_id: data.id,
          semester_name: "Semester 1",
          is_open: false,
        },
        {
          academic_session_id: data.id,
          semester_name: "Semester 2",
          is_open: false,
        },
      ]);

    setLoading(false);

    if (semesterInsertError) {
      alert(semesterInsertError.message);
      return;
    }

    setSessionName("");
    loadData();
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

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  async function toggleSessionField(
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

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  async function toggleSemester(id: string, value: boolean) {
    setLoading(true);

    const { error } = await supabase
      .from("session_semesters")
      .update({ is_open: !value })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-6 text-[#2d2414]">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Academic Session Management</h1>
          <p className="mt-2 text-sm text-[#6f6042]">
            Create sessions and open Semester 1 or Semester 2 independently.
          </p>
        </div>

        <section className="rounded-2xl border border-[#c9a84c]/30 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Create New Session</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="e.g. 2025/2026"
              className="rounded-xl border border-[#c9a84c]/30 bg-[#fdfaf4] p-3 outline-none"
            />

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
          {sessions.map((session) => {
            const sessionSemesters = semesters.filter(
              (semester) =>
                String(semester.academic_session_id) === String(session.id)
            );

            return (
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
                      Manage admissions, registration, and semester openings.
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
                        toggleSessionField(
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
                        toggleSessionField(
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

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {sessionSemesters.map((semester) => (
                    <div
                      key={semester.id}
                      className="rounded-xl border border-[#c9a84c]/20 bg-[#fdfaf4] p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold">
                            {semester.semester_name}
                          </h4>

                          <p className="mt-1 text-sm text-[#6f6042]">
                            {semester.is_open ? "Open" : "Closed"}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            toggleSemester(semester.id, semester.is_open)
                          }
                          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                            semester.is_open
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {semester.is_open ? "Close" : "Open"}
                        </button>
                      </div>
                    </div>
                  ))}

                  {sessionSemesters.length === 0 && (
                    <p className="text-sm text-red-600">
                      No semesters found for this session.
                    </p>
                  )}
                </div>
              </div>
            );
          })}

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