import InstructorShell from "@/components/InstructorShell";
import PrintButton from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function InstructorIdCardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      full_name,
      email,
      instructor_number,
      instructor_bio,
      teaching_qualification,
      instructor_passport_url,
      passport_url
    `)
    .eq("id", user.id)
    .single();

  return (
    <InstructorShell
      title="Instructor ID Card"
      subtitle="View and print your official EDC instructor identity card."
    >
      <section className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-end print:hidden">
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
              {profile?.instructor_passport_url || profile?.passport_url ? (
                <Image
                  src={profile.instructor_passport_url || profile.passport_url}
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
                {profile?.full_name || "Instructor Name"}
              </h1>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Instructor ID
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {profile?.instructor_number || "Not Assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Email
                  </p>
                  <p className="mt-1">{profile?.email || "Not available"}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                    Qualification
                  </p>
                  <p className="mt-1">
                    {profile?.teaching_qualification || "Not provided"}
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
    </InstructorShell>
  );
}