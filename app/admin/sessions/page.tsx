import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/utils/supabase/admin";

type AcademicSession = {
  id: string;
  session_name: string;
  admissions_open: boolean;
  registration_open: boolean;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  academic_session: string | null;
};

type IntakeBatch = {
  id: string;
  name: string;
  academic_session: string;
  entry_level: string;
  entry_semester: string;
  registration_status: string;
  description: string | null;
  cohort_code: string | null;
  admission_year: string | null;
  created_at: string;
  updated_at: string;
};

async function createAcademicSession(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionName = String(formData.get("session_name") || "").trim();
  const startDate = String(formData.get("start_date") || "") || null;
  const endDate = String(formData.get("end_date") || "") || null;

  if (!sessionName) {
    throw new Error("Session name is required.");
  }

  const { error } = await supabase.from("academic_sessions").insert({
    session_name: sessionName,
    academic_session: sessionName,
    admissions_open: false,
    registration_open: false,
    is_active: false,
    start_date: startDate,
    end_date: endDate,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function setActiveSession(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionId = String(formData.get("session_id") || "");

  if (!sessionId) {
    throw new Error("Session ID is missing.");
  }

  await supabase
    .from("academic_sessions")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .neq("id", sessionId);

  const { error } = await supabase
    .from("academic_sessions")
    .update({
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function openAdmissions(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionId = String(formData.get("session_id") || "");

  const { error } = await supabase
    .from("academic_sessions")
    .update({
      admissions_open: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function closeAdmissions(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionId = String(formData.get("session_id") || "");

  const { error } = await supabase
    .from("academic_sessions")
    .update({
      admissions_open: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function openRegistration(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionId = String(formData.get("session_id") || "");

  const { error } = await supabase
    .from("academic_sessions")
    .update({
      registration_open: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function closeRegistration(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const sessionId = String(formData.get("session_id") || "");

  const { error } = await supabase
    .from("academic_sessions")
    .update({
      registration_open: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function createIntakeBatch(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const name = String(formData.get("name") || "").trim();
  const academicSession = String(formData.get("academic_session") || "").trim();
  const entryLevel = String(formData.get("entry_level") || "").trim();
  const entrySemester = String(formData.get("entry_semester") || "").trim();
  const cohortCode = String(formData.get("cohort_code") || "").trim();
  const admissionYear = String(formData.get("admission_year") || "").trim();
  const description = String(formData.get("description") || "").trim();

  if (!name || !academicSession || !entryLevel || !entrySemester) {
    throw new Error("Name, session, level, and semester are required.");
  }

  const { error } = await supabase.from("intake_batches").insert({
    name,
    academic_session: academicSession,
    entry_level: entryLevel,
    entry_semester: entrySemester,
    registration_status: "open",
    description: description || null,
    cohort_code: cohortCode || "C1",
    admission_year: admissionYear || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function openBatchRegistration(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const batchId = String(formData.get("batch_id") || "");

  const { error } = await supabase
    .from("intake_batches")
    .update({
      registration_status: "open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

async function closeBatchRegistration(formData: FormData) {
  "use server";

  const supabase = createAdminClient();

  const batchId = String(formData.get("batch_id") || "");

  const { error } = await supabase
    .from("intake_batches")
    .update({
      registration_status: "closed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}

export default async function AdminSessionsPage() {
  const supabase = createAdminClient();

  const { data: sessions, error: sessionsError } = await supabase
    .from("academic_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: batches, error: batchesError } = await supabase
    .from("intake_batches")
    .select("*")
    .order("created_at", { ascending: false });

  if (sessionsError || batchesError) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Academic Sessions
        </h1>
        <p className="mt-4 text-red-600">
          {sessionsError?.message || batchesError?.message}
        </p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3b2f16]">
          Academic Sessions & Intake Batches
        </h1>
        <p className="mt-2 text-gray-600">
          Control admission sessions, registration, and student intake batches.
        </p>
      </div>

      <section className="mb-10 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#3b2f16]">
          Create Academic Session
        </h2>

        <form action={createAcademicSession} className="grid gap-4 md:grid-cols-3">
          <input
            name="session_name"
            placeholder="2026/2027"
            className="rounded-lg border p-3 outline-none"
            required
          />

          <input
            type="date"
            name="start_date"
            className="rounded-lg border p-3 outline-none"
          />

          <input
            type="date"
            name="end_date"
            className="rounded-lg border p-3 outline-none"
          />

          <button
            type="submit"
            className="rounded-lg bg-[#3b2f16] px-4 py-3 text-white"
          >
            Create Session
          </button>
        </form>
      </section>

      <section className="mb-10 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#3b2f16]">
          Academic Sessions
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#f8f1df] text-left">
              <tr>
                <th className="p-4">Session</th>
                <th className="p-4">Admissions</th>
                <th className="p-4">Registration</th>
                <th className="p-4">Active</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(sessions as AcademicSession[]).map((session) => (
                <tr key={session.id} className="border-t">
                  <td className="p-4 font-semibold">
                    {session.session_name}
                  </td>

                  <td className="p-4">
                    {session.admissions_open ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Open
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Closed
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {session.registration_open ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Open
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Closed
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {session.is_active ? (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-gray-600">
                    {session.start_date || "No start date"} -{" "}
                    {session.end_date || "No end date"}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <form action={setActiveSession}>
                        <input
                          type="hidden"
                          name="session_id"
                          value={session.id}
                        />
                        <button className="rounded bg-blue-700 px-3 py-2 text-xs text-white">
                          Set Active
                        </button>
                      </form>

                      {session.admissions_open ? (
                        <form action={closeAdmissions}>
                          <input
                            type="hidden"
                            name="session_id"
                            value={session.id}
                          />
                          <button className="rounded bg-red-600 px-3 py-2 text-xs text-white">
                            Close Admissions
                          </button>
                        </form>
                      ) : (
                        <form action={openAdmissions}>
                          <input
                            type="hidden"
                            name="session_id"
                            value={session.id}
                          />
                          <button className="rounded bg-green-700 px-3 py-2 text-xs text-white">
                            Open Admissions
                          </button>
                        </form>
                      )}

                      {session.registration_open ? (
                        <form action={closeRegistration}>
                          <input
                            type="hidden"
                            name="session_id"
                            value={session.id}
                          />
                          <button className="rounded bg-red-600 px-3 py-2 text-xs text-white">
                            Close Registration
                          </button>
                        </form>
                      ) : (
                        <form action={openRegistration}>
                          <input
                            type="hidden"
                            name="session_id"
                            value={session.id}
                          />
                          <button className="rounded bg-green-700 px-3 py-2 text-xs text-white">
                            Open Registration
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#3b2f16]">
          Create Intake Batch
        </h2>

        <form action={createIntakeBatch} className="grid gap-4 md:grid-cols-3">
          <input
            name="name"
            placeholder="2026 Semester 1 Intake"
            className="rounded-lg border p-3 outline-none"
            required
          />

          <select
            name="academic_session"
            className="rounded-lg border p-3 outline-none"
            required
          >
            <option value="">Select academic session</option>
            {(sessions as AcademicSession[]).map((session) => (
              <option key={session.id} value={session.session_name}>
                {session.session_name}
              </option>
            ))}
          </select>

          <input
            name="entry_level"
            placeholder="Level 1"
            defaultValue="Level 1"
            className="rounded-lg border p-3 outline-none"
            required
          />

          <input
            name="entry_semester"
            placeholder="Semester 1"
            defaultValue="Semester 1"
            className="rounded-lg border p-3 outline-none"
            required
          />

          <input
            name="cohort_code"
            placeholder="C1"
            defaultValue="C1"
            className="rounded-lg border p-3 outline-none"
          />

          <input
            name="admission_year"
            placeholder="2026"
            className="rounded-lg border p-3 outline-none"
          />

          <textarea
            name="description"
            placeholder="Batch description"
            className="rounded-lg border p-3 outline-none md:col-span-3"
          />

          <button
            type="submit"
            className="rounded-lg bg-[#3b2f16] px-4 py-3 text-white"
          >
            Create Intake Batch
          </button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-[#3b2f16]">
          Intake Batches
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[#f8f1df] text-left">
              <tr>
                <th className="p-4">Batch</th>
                <th className="p-4">Session</th>
                <th className="p-4">Level</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Cohort</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(batches as IntakeBatch[]).map((batch) => (
                <tr key={batch.id} className="border-t">
                  <td className="p-4">
                    <p className="font-semibold">{batch.name}</p>
                    <p className="text-xs text-gray-500">
                      {batch.description || "No description"}
                    </p>
                  </td>

                  <td className="p-4">{batch.academic_session}</td>
                  <td className="p-4">{batch.entry_level}</td>
                  <td className="p-4">{batch.entry_semester}</td>
                  <td className="p-4">{batch.cohort_code || "C1"}</td>

                  <td className="p-4">
                    {batch.registration_status === "open" ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Open
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        Closed
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    {batch.registration_status === "open" ? (
                      <form action={closeBatchRegistration}>
                        <input type="hidden" name="batch_id" value={batch.id} />
                        <button className="rounded bg-red-600 px-3 py-2 text-xs text-white">
                          Close Batch
                        </button>
                      </form>
                    ) : (
                      <form action={openBatchRegistration}>
                        <input type="hidden" name="batch_id" value={batch.id} />
                        <button className="rounded bg-green-700 px-3 py-2 text-xs text-white">
                          Open Batch
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}