import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminAdmissionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const { data: admissions, error } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AdminShell
      title="Admissions Management"
      subtitle="View and manage all submitted admission applications."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-label">EDC Admissions</p>

            <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              Student Applications
            </h1>
          </div>

          <div className="border border-[#c9a84c]/20 bg-[#fdfaf4] px-6 py-4">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/50">
              Total Applications
            </p>

            <h2 className="mt-2 text-4xl font-semibold text-[#0b1f3a]">
              {admissions?.length || 0}
            </h2>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="min-w-full border border-[#c9a84c]/20">
            <thead className="bg-[#fdfaf4]">
              <tr>
                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Full Name
                </th>

                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Email
                </th>

                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Phone
                </th>

                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Country
                </th>

                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Level
                </th>

                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Semester
                </th>

                <th className="border border-[#c9a84c]/10 p-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {admissions?.map((application: any) => (
                <tr key={application.id}>
                  <td className="border border-[#c9a84c]/10 p-4">
                    {application.full_name}
                  </td>

                  <td className="border border-[#c9a84c]/10 p-4">
                    {application.email}
                  </td>

                  <td className="border border-[#c9a84c]/10 p-4">
                    {application.phone}
                  </td>

                  <td className="border border-[#c9a84c]/10 p-4">
                    {application.country}
                  </td>

                  <td className="border border-[#c9a84c]/10 p-4">
                    {application.desired_level}
                  </td>

                  <td className="border border-[#c9a84c]/10 p-4">
                    {application.desired_semester}
                  </td>

                  <td className="border border-[#c9a84c]/10 p-4">
                    <span className="rounded bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                      {application.application_status}
                    </span>
                  </td>
                </tr>
              ))}

              {(!admissions || admissions.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-[#1c2b3a]/60"
                  >
                    No admission applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}