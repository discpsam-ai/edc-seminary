import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminCourseRegistrationsPage() {
  const supabase = await createClient();

  const { data: registrations, error } = await supabase
    .from("course_registrations")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email,
        student_number
      ),
      courses:course_id (
        title,
        credit_units
      )
    `)
    .order("registered_at", { ascending: false });

  async function updateRegistrationStatus(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const registrationId = formData.get("registration_id") as string;
    const status = formData.get("status") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload: any = {
      approval_status: status,
      updated_at: new Date().toISOString(),
    };

    if (status === "approved") {
      payload.approved_by = user?.id;
      payload.approved_at = new Date().toISOString();
    }

    if (status === "locked") {
      payload.locked_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("course_registrations")
      .update(payload)
      .eq("id", registrationId);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/course-registrations");
  }

  return (
    <AdminShell
      title="Course Registrations"
      subtitle="Review, approve, reject, and lock student course registrations."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Student Course Registrations
        </h2>

        {error && <p className="mt-6 text-red-600">{error.message}</p>}

        {!registrations || registrations.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No course registration has been submitted yet.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {registrations.map((registration: any) => (
              <div
                key={registration.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="section-label">{registration.course_code}</p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                      {registration.courses?.title || registration.course_code}
                    </h3>

                    <p className="mt-2 text-sm text-[#1c2b3a]/60">
                      Student: {registration.profiles?.full_name || "Unnamed"}
                    </p>

                    <p className="mt-1 text-sm text-[#1c2b3a]/60">
                      Student ID:{" "}
                      {registration.profiles?.student_number || "Not assigned"}
                    </p>

                    <p className="mt-1 text-sm text-[#1c2b3a]/60">
                      {registration.level} • {registration.semester} •{" "}
                      {registration.academic_session}
                    </p>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {registration.approval_status || "pending"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <form action={updateRegistrationStatus}>
                    <input
                      type="hidden"
                      name="registration_id"
                      value={registration.id}
                    />

                    <input type="hidden" name="status" value="approved" />

                    <button type="submit" className="btn-gold w-full">
                      Approve
                    </button>
                  </form>

                  <form action={updateRegistrationStatus}>
                    <input
                      type="hidden"
                      name="registration_id"
                      value={registration.id}
                    />

                    <input type="hidden" name="status" value="locked" />

                    <button
                      type="submit"
                      className="w-full border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                    >
                      Lock
                    </button>
                  </form>

                  <form action={updateRegistrationStatus}>
                    <input
                      type="hidden"
                      name="registration_id"
                      value={registration.id}
                    />

                    <input type="hidden" name="status" value="rejected" />

                    <button
                      type="submit"
                      className="w-full border border-red-300 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-red-600"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}