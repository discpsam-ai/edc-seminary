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

const semesterList = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export default function AdminSessionsPage() {
  const supabase = createClient();

  const [sessions, setSessions] =
    useState<AcademicSession[]>([]);

  const [semesters, setSemesters] =
    useState<SessionSemester[]>([]);

  const [sessionName, setSessionName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function loadData() {
    const {
      data: sessionData,
      error: sessionError,
    } = await supabase
      .from("academic_sessions")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (sessionError) {
      alert(sessionError.message);
      return;
    }

    const {
      data: semesterData,
      error: semesterError,
    } = await supabase
      .from("session_semesters")
      .select("*")
      .order("semester_name", {
        ascending: true,
      });

    if (semesterError) {
      alert(semesterError.message);
      return;
    }

    setSessions(sessionData || []);
    setSemesters(semesterData || []);
  }

  useEffect(() => {
    loadData();
  }, [supabase]);

  async function createSession() {
    if (!sessionName.trim()) {
      alert(
        "Enter session name e.g. 2026/2027"
      );
      return;
    }

    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("academic_sessions")
      .insert({
        session_name:
          sessionName.trim(),

        admissions_open: false,

        registration_open: false,

        is_active: false,
      })
      .select()
      .single();

    if (error || !data) {
      setLoading(false);

      alert(
        error?.message ||
          "Unable to create session."
      );

      return;
    }

    const semesterPayload: Omit<
      SessionSemester,
      "id"
    >[] = semesterList.map(
      (semesterName) => ({
        academic_session_id:
          data.id,

        semester_name:
          semesterName,

        is_open: false,
      })
    );

    const {
      error: semesterError,
    } = await supabase
      .from("session_semesters")
      .insert(semesterPayload);

    setLoading(false);

    if (semesterError) {
      alert(semesterError.message);
      return;
    }

    setSessionName("");

    loadData();
  }

  async function makeActive(
    sessionId: string
  ) {
    setLoading(true);

    await supabase
      .from("academic_sessions")
      .update({
        is_active: false,
      })
      .neq("id", sessionId);

    const { error } = await supabase
      .from("academic_sessions")
      .update({
        is_active: true,
      })
      .eq("id", sessionId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  async function toggleSessionField(
    sessionId: string,
    field:
      | "admissions_open"
      | "registration_open",
    currentValue: boolean
  ) {
    setLoading(true);

    const { error } = await supabase
      .from("academic_sessions")
      .update({
        [field]: !currentValue,
      })
      .eq("id", sessionId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  async function toggleSemester(
    semesterId: string,
    currentValue: boolean
  ) {
    setLoading(true);

    const { error } = await supabase
      .from("session_semesters")
      .update({
        is_open: !currentValue,
      })
      .eq("id", semesterId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    loadData();
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-6 text-[#2d2414]">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c9a84c]">
            EDC Academic Structure
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Academic Session
            Management
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6f6042]">
            Manage institutional
            sessions, activate
            concurrent semesters,
            control admissions,
            regulate registration,
            and maintain the
            official 8-semester
            progression structure
            of EDC.
          </p>
        </div>

        <section className="rounded-3xl border border-[#c9a84c]/30 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">
            Create Academic Session
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <input
              value={sessionName}
              onChange={(e) =>
                setSessionName(
                  e.target.value
                )
              }
              placeholder="e.g. 2026/2027"
              className="rounded-2xl border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button
              onClick={createSession}
              disabled={loading}
              className="rounded-2xl bg-[#0b1f3a] px-8 py-4 font-semibold text-white transition hover:bg-[#10294b] disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Session"}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-[#c9a84c]/20 bg-[#fdfaf4] p-5">
            <p className="text-sm leading-7 text-[#6f6042]">
              Every academic session
              automatically carries:
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {semesterList.map(
                (semester) => (
                  <span
                    key={semester}
                    className="rounded-full border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                  >
                    {semester}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {sessions.map((session) => {
            const sessionSemesters =
              semesters.filter(
                (semester) =>
                  String(
                    semester.academic_session_id
                  ) ===
                  String(session.id)
              );

            return (
              <div
                key={session.id}
                className="rounded-3xl border border-[#c9a84c]/30 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-3xl font-bold text-[#0b1f3a]">
                        {
                          session.session_name
                        }
                      </h2>

                      {session.is_active && (
                        <span className="rounded-full border border-green-300 bg-green-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-green-700">
                          Active Session
                        </span>
                      )}
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f6042]">
                      Control semester
                      availability,
                      admissions,
                      registration,
                      and institutional
                      academic flow.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        makeActive(
                          session.id
                        )
                      }
                      className="rounded-2xl border border-[#0b1f3a] px-5 py-3 text-sm font-semibold text-[#0b1f3a]"
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
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold ${
                        session.admissions_open
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Admissions{" "}
                      {session.admissions_open
                        ? "Open"
                        : "Closed"}
                    </button>

                    <button
                      onClick={() =>
                        toggleSessionField(
                          session.id,
                          "registration_open",
                          session.registration_open
                        )
                      }
                      className={`rounded-2xl px-5 py-3 text-sm font-semibold ${
                        session.registration_open
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      Registration{" "}
                      {session.registration_open
                        ? "Open"
                        : "Closed"}
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {sessionSemesters.map(
                    (semester) => (
                      <div
                        key={semester.id}
                        className="rounded-2xl border border-[#c9a84c]/20 bg-[#fdfaf4] p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                              EDC Semester
                            </p>

                            <h3 className="mt-3 text-xl font-bold text-[#0b1f3a]">
                              {
                                semester.semester_name
                              }
                            </h3>

                            <p className="mt-3 text-sm text-[#6f6042]">
                              {semester.is_open
                                ? "Open For Institutional Operations"
                                : "Currently Closed"}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] ${
                              semester.is_open
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {semester.is_open
                              ? "Open"
                              : "Closed"}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            toggleSemester(
                              semester.id,
                              semester.is_open
                            )
                          }
                          className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold ${
                            semester.is_open
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {semester.is_open
                            ? "Close Semester"
                            : "Open Semester"}
                        </button>
                      </div>
                    )
                  )}
                </div>

                {sessionSemesters.length ===
                  0 && (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    No semesters were
                    found for this
                    academic session.
                  </div>
                )}
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#c9a84c]/40 bg-white p-10 text-center">
              <h3 className="text-2xl font-semibold text-[#0b1f3a]">
                No Academic Session
                Created
              </h3>

              <p className="mt-4 text-sm text-[#6f6042]">
                Create your first
                institutional session
                to begin academic
                operations.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}