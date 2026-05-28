import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";

type OpenSemester = {
  id: string;
  semester_name: string;
  is_open: boolean;
};

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const { data: activeSession } = await supabase
    .from("academic_sessions")
    .select(
      `
      id,
      session_name,
      admissions_open,
      registration_open,
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

  return (
    <AdminShell
      title="Institution Settings"
      subtitle="Manage institutional identity, academic session settings, portal configuration, and administrative controls."
    >
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Institutional Information
          </h2>

          <form className="mt-8 grid gap-5">
            <input
              defaultValue="Ecclesia Discipleship & Commissioning"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Institution Name"
            />

            <input
              defaultValue="Awakening Ecclesia"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Parent Ministry"
            />

            <input
              value={activeSession?.session_name || ""}
              readOnly
              className="border border-[#c9a84c]/30 bg-[#f7f3ec] p-4 outline-none"
              placeholder="Academic Session"
            />

            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
              <p className="text-sm font-semibold text-[#0b1f3a]">
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

            <button type="button" className="btn-gold">
              Save Settings
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Portal Configuration
          </h2>

          <form className="mt-8 grid gap-5">
            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Admissions Status
              </p>

              <p
                className={`mt-2 text-lg font-semibold ${
                  activeSession?.admissions_open
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {activeSession?.admissions_open ? "Open" : "Closed"}
              </p>
            </div>

            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Registration Status
              </p>

              <p
                className={`mt-2 text-lg font-semibold ${
                  activeSession?.registration_open
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {activeSession?.registration_open
                  ? "Open"
                  : "Closed"}
              </p>
            </div>

            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Portal Access
              </p>

              <p className="mt-2 text-lg font-semibold text-green-700">
                Enabled
              </p>
            </div>

            <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Commissioning Access
              </p>

              <p className="mt-2 text-lg font-semibold text-[#0b1f3a]">
                Restricted
              </p>
            </div>

            <textarea
              defaultValue="Institutional settings and configuration controls for EDC."
              className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Administrative Notes"
            />

            <button type="button" className="btn-gold">
              Update Configuration
            </button>
          </form>
        </div>
      </section>
    </AdminShell>
  );
}