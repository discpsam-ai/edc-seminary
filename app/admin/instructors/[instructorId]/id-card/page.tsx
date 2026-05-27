import AdminShell from "@/components/AdminShell";
import PrintButton from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    instructorId: string;
  }>;
};

export default async function AdminInstructorIdCardPage({ params }: PageProps) {
  const { instructorId } = await params;

  const supabase = await createClient();

  const { data: instructor } = await supabase
    .from("profiles")
    .select(`
      full_name,
      email,
      instructor_number,
      teaching_qualification,
      instructor_passport_url,
      passport_url
    `)
    .eq("id", instructorId)
    .single();

  if (!instructor) notFound();

  return (
    <AdminShell
      title="Instructor ID Card"
      subtitle="Print official instructor identity card."
    >
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-between print:hidden">
          <Link
            href={`/admin/instructors/${instructorId}`}
            className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
          >
            Back
          </Link>

          <PrintButton />
        </div>

        <div className="overflow-hidden border border-[#c9a84c]/30 bg-[#0b1f3a] text-white shadow-xl">
          <div className="bg-[#071528] p-6 text-center">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="EDC Logo"
                width={80}
                height={80}
                className="h-16 w-auto"
              />
            </div>

            <h2 className="mt-4 font-edc-serif text-3xl font-semibold">
              Ecclesia Discipleship & Commissioning
            </h2>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-[#c9a84c]">
              Instructor Identity Card
            </p>
          </div>

          <div className="grid gap-6 bg-[#fdfaf4] p-8 text-[#0b1f3a] md:grid-cols-[auto_1fr]">
            <div className="flex h-44 w-36 items-center justify-center overflow-hidden border border-[#c9a84c]/30 bg-[#f7f3ec]">
              {instructor.instructor_passport_url || instructor.passport_url ? (
                <Image
                  src={
                    instructor.instructor_passport_url ||
                    instructor.passport_url
                  }
                  alt="Instructor Passport"
                  width={300}
                  height={400}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/40">
                  Passport
                </div>
              )}
            </div>

            <div>
              <p className="section-label">Instructor</p>

              <h1 className="mt-3 font-edc-serif text-4xl font-semibold">
                {instructor.full_name || "Instructor Name"}
              </h1>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Instructor ID
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {instructor.instructor_number || "Not Assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Email
                  </p>

                  <p className="mt-1">{instructor.email || "Not available"}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Qualification
                  </p>

                  <p className="mt-1">
                    {instructor.teaching_qualification || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#071528] p-5 text-center text-xs uppercase tracking-[0.2em] text-[#c9a84c]">
            Authorized Teaching & Formation Personnel
          </div>
        </div>
      </section>
    </AdminShell>
  );
}