import PassportUploadForm from "@/components/PassportUploadForm";
import PortalShell from "@/components/PortalShell";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(
      `
      id,
      session_name,
      is_active,
      session_semesters (
        id,
        semester_name,
        is_open
      )
    `
    )
    .eq("is_active", true)
    .maybeSingle();

  const openSemesters =
    activeSession?.session_semesters?.filter(
      (semester: OpenSemester) => semester.is_open
    ) || [];

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      `
      full_name,
      email,
      role,
      level,
      current_semester,
      student_number,
      passport_url,
      intake_batches:intake_batch_id (
        name,
        academic_session,
        entry_semester
      )
    `
    )
    .eq("id", user.id)
    .single();

  const intakeBatch = Array.isArray(profile?.intake_batches)
    ? profile?.intake_batches?.[0]
    : profile?.intake_batches;

  return (
    <PortalShell
      title="Student Profile"
      subtitle="View your personal information, academic identity, formation status, and institutional records."
    >
      <section className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <div className="mx-auto flex h-[260px] max-w-[220px] items-center justify-center overflow-hidden border border-[#c9a84c]/20 bg-[#f7f3ec]/90 p-3">
            {profile?.passport_url ? (
              <Image
                src={profile.passport_url}
                alt="Student Passport"
                width={400}
                height={500}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/40">
                Passport
              </div>
            )}
          </div>

          <PassportUploadForm userId={user.id} />

          <div className="mt-8 text-center">
            <h2 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              {profile?.full_name || "Student"}
            </h2>

            <p className="mt-3 text-sm uppercase tracking-[0.15em] text-[#c9a84c]">
              EDC Student
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {[
              ["Student ID", profile?.student_number || "Not assigned"],

              ["Current Level", profile?.level || "Not assigned"],

              [
                "Current Semester",
                profile?.current_semester || "Not assigned",
              ],

              [
                "Intake Batch",
                intakeBatch?.name || "Not assigned",
              ],

              [
                "Academic Session",
                activeSession?.session_name ||
                  intakeBatch?.academic_session ||
                  "Not assigned",
              ],

              [
                "Entry Semester",
                intakeBatch?.entry_semester || "Not assigned",
              ],

              ["Email", profile?.email || "Not available"],

              ["Role", profile?.role || "student"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  {label}
                </p>

                <h3 className="mt-2 text-[#0b1f3a]">{value}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Academic Status
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Active Session
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {activeSession?.session_name || "No Active Session"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Current Semester
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {profile?.current_semester || "Not assigned"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Open Semesters
                </p>

                <div className="mt-3 space-y-2">
                  {openSemesters.length > 0 ? (
                    openSemesters.map((semester: OpenSemester) => (
                      <div
                        key={semester.id}
                        className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                      >
                        {semester.semester_name} Open
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      No semester currently open
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
            <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Personal Information
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Full Name
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {profile?.full_name || "Not available"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Student ID
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {profile?.student_number || "Not assigned"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Email Address
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {profile?.email || "Not available"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Current Level
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {profile?.level || "Not assigned"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Intake Batch
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {intakeBatch?.name || "Not assigned"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Entry Semester
                </p>

                <p className="mt-2 text-[#0b1f3a]">
                  {intakeBatch?.entry_semester || "Not assigned"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                  Institutional Note
                </p>

                <p className="mt-2 leading-7 text-[#1c2b3a]/70">
                  Your Student ID is your official institutional identity for
                  EDC Seminary records, transcripts, results, certificates,
                  attendance, formation records, and verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}