import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `EDC/CERT/${year}/${random}`;
}

function generateVerificationCode() {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();

  return `EDC-${random}`;
}

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  const { data: graduationRecords, error: graduationError } = await supabase
    .from("graduation_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email,
        student_number
      )
    `)
    .eq("graduation_status", "eligible")
    .eq("certificate_issued", false)
    .order("created_at", { ascending: false });

  const { data: certificates, error: certificateError } = await supabase
    .from("certificate_records")
    .select(`
      *,
      profiles:student_id (
        full_name,
        email,
        student_number
      )
    `)
    .order("created_at", { ascending: false });

  async function issueCertificate(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const graduationRecordId = formData.get("graduation_record_id") as string;
    const certificateType = formData.get("certificate_type") as string;
    const certificateTitle = formData.get("certificate_title") as string;
    const remarks = formData.get("remarks") as string;

    const { data: graduationRecord } = await supabase
      .from("graduation_records")
      .select("*")
      .eq("id", graduationRecordId)
      .single();

    if (!graduationRecord) {
      throw new Error("Graduation record not found.");
    }

    if (graduationRecord.graduation_status !== "eligible") {
      throw new Error("This student is not yet eligible for certificate issuance.");
    }

    if (graduationRecord.certificate_issued) {
      throw new Error("Certificate has already been issued for this graduation record.");
    }

    const { data: studentProfile } = await supabase
      .from("profiles")
      .select("student_number")
      .eq("id", graduationRecord.student_id)
      .single();

    if (!studentProfile?.student_number) {
      throw new Error(
        "This student does not have a Student ID yet. Generate Student ID before issuing certificate."
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const certificateNumber = generateCertificateNumber();
    const verificationCode = generateVerificationCode();

    const { error } = await supabase.from("certificate_records").insert({
      student_id: graduationRecord.student_id,
      certificate_number: certificateNumber,
      verification_code: verificationCode,
      certificate_title: certificateTitle,
      certificate_type: certificateType || "completion",
      academic_session: graduationRecord.academic_session,
      cgpa: graduationRecord.cgpa,
      classification: graduationRecord.classification,
      graduation_status: graduationRecord.graduation_status,
      commissioning_status:
        graduationRecord.commissioning_clearance ? "approved" : "pending",
      certificate_status: "issued",
      level_completed: graduationRecord.level || "Completed Programme",
      issued_by: user?.id,
      issued_at: new Date().toISOString(),
      remarks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    const { error: graduationUpdateError } = await supabase
      .from("graduation_records")
      .update({
        certificate_issued: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", graduationRecordId);

    if (graduationUpdateError) {
      throw new Error(graduationUpdateError.message);
    }

    revalidatePath("/admin/certificates");
  }

  return (
    <AdminShell
      title="Certificate Issuance"
      subtitle="Issue official EDC certificates to eligible graduating students."
    >
      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Issue Certificate
          </h2>

          {graduationError && (
            <p className="mt-6 text-red-600">{graduationError.message}</p>
          )}

          {!graduationRecords || graduationRecords.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No eligible student is awaiting certificate issuance.
            </p>
          ) : (
            <form action={issueCertificate} className="mt-8 grid gap-5">
              <select
                name="graduation_record_id"
                required
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="">Select Eligible Student</option>

                {graduationRecords.map((record: any) => (
                  <option key={record.id} value={record.id}>
                    {record.profiles?.full_name} —{" "}
                    {record.profiles?.student_number || "No Student ID"} —{" "}
                    {record.academic_session} — {record.classification}
                  </option>
                ))}
              </select>

              <input
                name="certificate_title"
                required
                defaultValue="Certificate of Completion"
                placeholder="Certificate Title"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              />

              <select
                name="certificate_type"
                required
                defaultValue="completion"
                className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
              >
                <option value="completion">Completion Certificate</option>
                <option value="graduation">Graduation Certificate</option>
                <option value="commissioning">Commissioning Certificate</option>
                <option value="ministry">Ministry Certificate</option>
              </select>

              <textarea
  name="remarks"
  placeholder="Certificate remarks..."
  spellCheck={false}
  className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none transition"
/>

              <button type="submit" className="btn-gold">
                Issue Certificate
              </button>
            </form>
          )}
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Issued Certificates
          </h2>

          {certificateError && (
            <p className="mt-6 text-red-600">{certificateError.message}</p>
          )}

          {!certificates || certificates.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No certificate has been issued yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {certificates.map((certificate: any) => (
                <div
                  key={certificate.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="section-label">
                        {certificate.certificate_type}
                      </p>

                      <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                        {certificate.profiles?.full_name || "Unnamed Student"}
                      </h3>

                      <p className="mt-2 text-sm text-[#1c2b3a]/60">
                        Student ID:{" "}
                        {certificate.profiles?.student_number || "Not assigned"}
                      </p>

                      <p className="mt-1 text-sm text-[#1c2b3a]/60">
                        Certificate No: {certificate.certificate_number}
                      </p>

                      <p className="mt-1 text-sm text-[#1c2b3a]/60">
                        Verification Code: {certificate.verification_code}
                      </p>
                    </div>

                    <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {certificate.certificate_status || "issued"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">Session</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {certificate.academic_session || "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">CGPA</p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {Number(certificate.cgpa || 0).toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[#1c2b3a]/60">
                        Classification
                      </p>
                      <p className="mt-1 font-semibold text-[#0b1f3a]">
                        {certificate.classification || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href={`/admin/certificates/${certificate.id}`}
                      className="btn-gold"
                    >
                      Open Certificate
                    </Link>

                    <Link
                      href={`/verify-certificate/${certificate.verification_code}`}
                      className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
                    >
                      Verify
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminShell>
  );
}