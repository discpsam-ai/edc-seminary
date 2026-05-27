import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminInstructorApplicationsPage() {
  const supabase = await createClient();

  const { data: applications, error } = await supabase
    .from("instructor_applications")
    .select("*")
    .order("created_at", { ascending: false });

  async function approveApplication(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const applicationId = formData.get("application_id") as string;
    const email = formData.get("email") as string;
    const fullName = formData.get("full_name") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const year = new Date().getFullYear().toString().slice(-2);

    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .not("instructor_number", "is", null);

    const serial = String((count || 0) + 1).padStart(3, "0");

    const instructorNumber = `EDC/INS/${year}/${serial}`;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({
          role: "instructor",
          instructor_number: instructorNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);
    }

    await supabase
      .from("instructor_applications")
      .update({
        application_status: "approved",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    revalidatePath("/admin/instructors/applications");
  }

  async function rejectApplication(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const applicationId = formData.get("application_id") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("instructor_applications")
      .update({
        application_status: "rejected",
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicationId);

    revalidatePath("/admin/instructors/applications");
  }

  return (
    <AdminShell
      title="Instructor Applications"
      subtitle="Review instructor applications, approve qualified instructors, and manage academic teaching appointments."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Instructor Applications
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!applications || applications.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No instructor application submitted yet.
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            {applications.map((application: any) => (
              <div
                key={application.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="section-label">
                      {application.application_status}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                      {application.full_name}
                    </h3>

                    <p className="mt-2 text-[#1c2b3a]/70">
                      {application.email}
                    </p>

                    {application.phone && (
                      <p className="mt-1 text-[#1c2b3a]/60">
                        {application.phone}
                      </p>
                    )}
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {application.application_status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Qualification
                    </p>

                    <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                      {application.qualification || "Not provided"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Preferred Courses
                    </p>

                    <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                      {application.preferred_courses || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Teaching Experience
                  </p>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[#1c2b3a]/70">
                    {application.teaching_experience || "Not provided"}
                  </p>
                </div>

                <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Ministry Background
                  </p>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[#1c2b3a]/70">
                    {application.ministry_background || "Not provided"}
                  </p>
                </div>

                <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Reason For Applying
                  </p>

                  <p className="mt-3 whitespace-pre-wrap leading-7 text-[#1c2b3a]/70">
                    {application.reason_for_applying}
                  </p>
                </div>

                {application.application_status === "pending" && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    <form action={approveApplication}>
                      <input
                        type="hidden"
                        name="application_id"
                        value={application.id}
                      />

                      <input
                        type="hidden"
                        name="email"
                        value={application.email}
                      />

                      <input
                        type="hidden"
                        name="full_name"
                        value={application.full_name}
                      />

                      <button type="submit" className="btn-gold">
                        Approve Instructor
                      </button>
                    </form>

                    <form action={rejectApplication}>
                      <input
                        type="hidden"
                        name="application_id"
                        value={application.id}
                      />

                      <button
                        type="submit"
                        className="border border-red-300 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-red-600"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}