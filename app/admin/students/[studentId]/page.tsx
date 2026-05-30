import Link from "next/link";
import { createAdminClient } from "@/utils/supabase/admin";

type PageProps = {
  params: Promise<{
    studentId: string;
  }>;
};

export default async function AdminStudentDetailPage({ params }: PageProps) {
  const { studentId } = await params;
  const supabase = createAdminClient();

  const { data: student, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error || !student) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Student not found</h1>
        <Link href="/admin/students" className="mt-6 inline-block underline">
          Back to Students
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      <Link href="/admin/students" className="text-sm underline">
        ← Back to Students
      </Link>

      <section className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0b1f3a]">
          {student.full_name || "Unnamed Student"}
        </h1>

        <p className="mt-2 text-gray-600">{student.email}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <p><b>Student ID:</b> {student.student_number || "Not assigned"}</p>
          <p><b>Phone:</b> {student.phone || "Not provided"}</p>
          <p><b>Level:</b> {student.level || "Not assigned"}</p>
          <p><b>Semester:</b> {student.current_semester || "Not assigned"}</p>
          <p><b>Role:</b> {student.role || "student"}</p>
          <p><b>Academic Status:</b> {student.academic_status || "active"}</p>
          <p><b>Admission Set:</b> {student.admission_set || "Not assigned"}</p>
          <p><b>Cohort:</b> {student.cohort_name || "Not assigned"}</p>
        </div>

        {student.passport_url && (
          <div className="mt-8">
            <p className="mb-3 font-semibold">Passport Photograph</p>
            <img
              src={student.passport_url}
              alt="Student Passport"
              className="h-40 w-40 rounded-lg border object-cover"
            />
          </div>
        )}
      </section>
    </main>
  );
}