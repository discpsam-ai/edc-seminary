import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";

type PageProps = {
  params: Promise<{
    studentId: string;
  }>;
};

export default async function AdminStudentIdCardPage({
  params,
}: PageProps) {
  const { studentId } = await params;

  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("profiles")
    .select("full_name, email, level, student_number, passport_url")
    .eq("id", studentId)
    .single();

  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap justify-between gap-4 print:hidden">
          <Link href="/admin/id-cards" className="btn-gold">
            Back to ID Cards
          </Link>

          <PrintButton />
        </div>

        {error || !student ? (
          <p className="text-red-600">Student not found.</p>
        ) : (
          <div className="flex justify-center">
            <div className="relative w-full max-w-md overflow-hidden border border-[#c9a84c]/30 bg-[#071528] text-[#fdfaf4] shadow-2xl">
              <div className="absolute inset-0 opacity-[0.05]">
                <div
                  className="h-full w-full bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('/logo.png')",
                  }}
                />
              </div>

              <div className="relative z-10 p-8">
                <div className="flex items-center gap-4 border-b border-[#c9a84c]/20 pb-5">
                  <Image
                    src="/logo.png"
                    alt="EDC Logo"
                    width={60}
                    height={60}
                    className="h-14 w-auto"
                  />

                  <div>
                    <h1 className="font-edc-serif text-2xl font-bold">
                      ECCLESIA
                    </h1>

                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#c9a84c]">
                      Discipleship & Commissioning
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center text-center">
                  <div className="flex h-44 w-36 items-center justify-center overflow-hidden border border-[#c9a84c]/30 bg-[#f7f3ec]">
                    {student.passport_url ? (
                      <Image
                        src={student.passport_url}
                        alt="Student Passport"
                        width={300}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/40">
                        Passport
                      </div>
                    )}
                  </div>

                  <h2 className="mt-6 font-edc-serif text-3xl font-semibold">
                    {student.full_name}
                  </h2>

                  <p className="mt-2 text-sm uppercase tracking-[0.15em] text-[#c9a84c]">
                    Seminary Student
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="border border-[#c9a84c]/20 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]/70">
                      Student ID
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      {student.student_number || "Not assigned"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]/70">
                      Current Level
                    </p>

                    <p className="mt-2 text-lg font-semibold">
                      {student.level || "Not assigned"}
                    </p>
                  </div>

                  <div className="border border-[#c9a84c]/20 bg-white/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]/70">
                      Institution
                    </p>

                    <p className="mt-2 text-sm leading-7 text-[#fdfaf4]/80">
                      Ecclesia Discipleship & Commissioning Seminary
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-[#c9a84c]/20 pt-5 text-center">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#fdfaf4]/50">
                    Official Institutional Identity Card
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}