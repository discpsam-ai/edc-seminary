import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdmissionApplicationPage() {
  const supabase = await createClient();

  const { data: intakes } = await supabase
    .from("intake_batches")
    .select("id, name, academic_session, entry_level, entry_semester")
    .eq("registration_status", "open")
    .order("created_at", { ascending: false });

  async function submitApplication(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const intakeBatchId = formData.get("intake_batch_id") as string;
    const passportFile = formData.get("passport") as File;

    let passportUrl = "";

    if (passportFile && passportFile.size > 0) {
      const fileExt = passportFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `passports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("admission-passports")
        .upload(filePath, passportFile);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("admission-passports")
        .getPublicUrl(filePath);

      passportUrl = publicUrl;
    }

    const { data: selectedIntake } = await supabase
      .from("intake_batches")
      .select("entry_level, entry_semester")
      .eq("id", intakeBatchId)
      .maybeSingle();

    const { error } = await supabase.from("admissions").insert({
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      location: formData.get("location") as string,
      intake_batch_id: intakeBatchId,
      desired_level: selectedIntake?.entry_level || "Level 1",
      desired_semester: selectedIntake?.entry_semester || "Semester 1",
      ministry_background: formData.get("ministry_background") as string,
      salvation_experience: formData.get("salvation_experience") as string,
      reason_for_applying: formData.get("reason_for_applying") as string,
      passport_url: passportUrl,
      application_status: "pending",
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admissions/apply/success");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] px-6 py-20">
      <section className="mx-auto max-w-4xl border border-[#c9a84c]/20 bg-white/90 p-8">
        <p className="section-label">EDC Admissions</p>

        <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Admission Application
        </h1>

        <p className="mt-4 max-w-3xl leading-8 text-[#1c2b3a]/70">
          Apply for Ecclesia Discipleship & Commissioning. Choose an open
          intake batch and provide your spiritual and academic details.
        </p>

        <form action={submitApplication} className="mt-10 grid gap-5">
          <input
            name="full_name"
            required
            placeholder="Full Name"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              name="country"
              placeholder="Country"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <input
              name="location"
              placeholder="Location / City"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />
          </div>

          <select
            name="intake_batch_id"
            required
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          >
            <option value="">Select Open Intake</option>

            {intakes?.map((intake: any) => (
              <option key={intake.id} value={intake.id}>
                {intake.name} — {intake.academic_session} —{" "}
                {intake.entry_level} — {intake.entry_semester}
              </option>
            ))}
          </select>

          <textarea
            name="salvation_experience"
            required
            placeholder="Briefly describe your salvation experience..."
            className="min-h-36 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <textarea
            name="ministry_background"
            placeholder="Briefly describe your ministry/church background..."
            className="min-h-36 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <textarea
            name="reason_for_applying"
            required
            placeholder="Why do you want to enroll in EDC?"
            className="min-h-36 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#0b1f3a]">
              Passport Photograph
            </label>

            <input
              type="file"
              name="passport"
              accept="image/*"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4"
            />

            <p className="text-sm text-[#1c2b3a]/60">
              Upload a clear passport photograph. Recommended size: below 1MB.
            </p>
          </div>

          <button type="submit" className="btn-gold">
            Submit Application
          </button>
        </form>
      </section>
    </main>
  );
}