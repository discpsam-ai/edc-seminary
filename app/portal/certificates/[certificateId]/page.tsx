import PortalShell from "@/components/PortalShell";
import PrintButton from "@/components/PrintButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

type StudentCertificatePageProps = {
  params: Promise<{
    certificateId: string;
  }>;
};

export default async function StudentCertificatePage({
  params,
}: StudentCertificatePageProps) {
  const { certificateId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: certificate, error } = await supabase
    .from("certificate_records")
    .select(
      `
      *,
      profiles:student_id (
        full_name,
        student_number,
        passport_url
      )
    `
    )
    .eq("id", certificateId)
    .eq("student_id", user.id)
    .single();

  if (error || !certificate) {
    notFound();
  }

  return (
    <PortalShell
      title="My Certificate"
      subtitle="Official EDC certificate document."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-12">
        <div className="mb-8 flex justify-end print:hidden">
          <PrintButton />
        </div>

        <div className="border-[12px] border-[#c9a84c]/30 p-10">
          <div className="text-center">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="EDC Logo"
                width={120}
                height={120}
                className="h-28 w-auto"
                priority
              />
            </div>

            <p className="mt-6 section-label">
              Ecclesia Discipleship & Commissioning
            </p>

            <h1 className="mt-6 font-edc-serif text-6xl font-semibold text-[#0b1f3a]">
              Certificate
            </h1>

            <p className="mt-8 text-lg uppercase tracking-[0.25em] text-[#1c2b3a]/60">
              This certifies that
            </p>

            <h2 className="mt-8 font-edc-serif text-6xl font-semibold text-[#c9a84c]">
              {certificate.profiles?.full_name || "Student Name"}
            </h2>

            <p className="mx-auto mt-10 max-w-4xl text-xl leading-10 text-[#1c2b3a]/75">
              has successfully completed the prescribed programme and
              discipleship formation requirements of Ecclesia Discipleship &
              Commissioning (EDC) and is hereby awarded this
            </p>

            <h3 className="mt-10 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {certificate.certificate_title || "Certificate"}
            </h3>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Certificate Number
                </p>

                <p className="mt-3 font-semibold text-[#0b1f3a]">
                  {certificate.certificate_number || "N/A"}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Academic Session
                </p>

                <p className="mt-3 font-semibold text-[#0b1f3a]">
                  {certificate.academic_session || "N/A"}
                  {certificate.semester ? ` — ${certificate.semester}` : ""}
                </p>
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
                <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Classification
                </p>

                <p className="mt-3 font-semibold text-[#0b1f3a]">
                  {certificate.classification || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-14 flex justify-center">
              <div className="flex h-48 w-40 items-center justify-center overflow-hidden border border-[#c9a84c]/20 bg-[#f7f3ec]">
                {certificate.profiles?.passport_url ? (
                  <img
                    src={certificate.profiles.passport_url}
                    alt="Student Passport"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-center text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/40">
                    Passport
                  </p>
                )}
              </div>
            </div>

            <div className="mt-16 grid gap-10 md:grid-cols-2">
              <div>
                <div className="border-t border-[#0b1f3a] pt-3 text-center text-sm">
                  Registrar
                </div>
              </div>

              <div>
                <div className="border-t border-[#0b1f3a] pt-3 text-center text-sm">
                  Academic Director
                </div>
              </div>
            </div>

            <div className="mt-12 border border-[#c9a84c]/20 bg-[#fdfaf4]/90 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                Verification Code
              </p>

              <p className="mt-3 font-semibold tracking-[0.2em] text-[#0b1f3a]">
                {certificate.verification_code || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PortalShell>
  );
}