import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";

type Admission = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  location: string | null;
  programme: string | null;
  passport_url: string | null;
  desired_level: string | null;
  desired_semester: string | null;
  intake_batch_id: string | null;
  status: string | null;
  created_at: string | null;
};

function generateTemporaryPassword() {
  return `EDC-${crypto.randomUUID().slice(0, 8)}-${Date.now()}`;
}

async function approveAdmission(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const admissionId = String(formData.get("admission_id") || "");

  if (!admissionId) {
    throw new Error("Admission ID is missing.");
  }

  const { data: admission, error: admissionError } = await supabase
    .from("admissions")
    .select("*")
    .eq("id", admissionId)
    .single();

  if (admissionError || !admission) {
    throw new Error(admissionError?.message || "Admission not found.");
  }

  if (!admission.email) {
    throw new Error("Applicant email is missing.");
  }

  const temporaryPassword = generateTemporaryPassword();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: admission.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: admission.full_name,
        role: "student",
      },
    });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Could not create auth user.");
  }

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    full_name: admission.full_name,
    email: admission.email,
    phone: admission.phone,
    country: admission.country,
    location: admission.location,
    programme: admission.programme,
    passport_url: admission.passport_url,
    desired_level: admission.desired_level,
    desired_semester: admission.desired_semester,
    intake_batch_id: admission.intake_batch_id,
    roles: ["student"],
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId);
    throw new Error(profileError.message);
  }

  const { error: updateError } = await supabase
    .from("admissions")
    .update({
      status: "approved",
      auth_user_id: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", admissionId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/admin/admissions");
  revalidatePath("/admin/students");
  redirect("/admin/admissions");
}

async function rejectAdmission(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const admissionId = String(formData.get("admission_id") || "");

  if (!admissionId) {
    throw new Error("Admission ID is missing.");
  }

  const { error } = await supabase
    .from("admissions")
    .update({
      status: "rejected",
      rejected_at: new Date().toISOString(),
    })
    .eq("id", admissionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/admissions");
  redirect("/admin/admissions");
}

export default async function AdminAdmissionsPage() {

  const supabase = createAdminClient();

  const { data: admissions, error } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-red-600">Admissions</h1>
        <p className="mt-4 text-red-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3b2f16]">
          Admissions Management
        </h1>
        <p className="mt-2 text-gray-600">
          Review, approve, or reject student admission applications.
        </p>
      </div>

      {!admissions || admissions.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-gray-600">No admission applications found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#f8f1df] text-left text-[#3b2f16]">
              <tr>
                <th className="p-4">Applicant</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Programme</th>
                <th className="p-4">Level/Semester</th>
                <th className="p-4">Passport</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(admissions as Admission[]).map((admission) => (
                <tr key={admission.id} className="border-t">
                  <td className="p-4 align-top">
                    <p className="font-semibold text-[#3b2f16]">
                      {admission.full_name || "Unnamed applicant"}
                    </p>
                    <p className="text-xs text-gray-500">{admission.id}</p>
                  </td>

                  <td className="p-4 align-top">
                    <p>{admission.email || "No email"}</p>
                    <p className="text-gray-500">
                      {admission.phone || "No phone"}
                    </p>
                    <p className="text-gray-500">
                      {[admission.location, admission.country]
                        .filter(Boolean)
                        .join(", ") || "No location"}
                    </p>
                  </td>

                  <td className="p-4 align-top">
                    {admission.programme || "Not specified"}
                  </td>

                  <td className="p-4 align-top">
                    <p>{admission.desired_level || "No level"}</p>
                    <p className="text-gray-500">
                      {admission.desired_semester || "No semester"}
                    </p>
                  </td>

                  <td className="p-4 align-top">
                    {admission.passport_url ? (
                      <a
                        href={admission.passport_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#8a6a16] underline"
                      >
                        View passport
                      </a>
                    ) : (
                      <span className="text-gray-400">No passport</span>
                    )}
                  </td>

                  <td className="p-4 align-top">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        admission.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : admission.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {admission.status || "pending"}
                    </span>
                  </td>

                  <td className="p-4 align-top">
                    {admission.status === "approved" ? (
                      <p className="text-sm text-green-700">Approved</p>
                    ) : admission.status === "rejected" ? (
                      <p className="text-sm text-red-700">Rejected</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <form action={approveAdmission}>
                          <input
                            type="hidden"
                            name="admission_id"
                            value={admission.id}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                          >
                            Approve Admission
                          </button>
                        </form>

                        <form action={rejectAdmission}>
                          <input
                            type="hidden"
                            name="admission_id"
                            value={admission.id}
                          />
                          <button
                            type="submit"
                            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          >
                            Reject Admission
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}