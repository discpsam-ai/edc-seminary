import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function InstructorApplicationPage() {
  async function submitApplication(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const location = formData.get("location") as string;
    const qualification = formData.get("qualification") as string;
    const teachingExperience = formData.get("teaching_experience") as string;
    const ministryBackground = formData.get("ministry_background") as string;
    const preferredCourses = formData.get("preferred_courses") as string;
    const availability = formData.get("availability") as string;
    const reasonForApplying = formData.get("reason_for_applying") as string;

    const passportFile = formData.get("passport") as File;
    let passportUrl = "";

    if (passportFile && passportFile.size > 0) {
      const fileExt = passportFile.name.split(".").pop();

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `instructor-passports/${fileName}`;

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

    const { error } = await supabase.from("instructor_applications").insert({
      full_name: fullName,
      email,
      phone,
      country,
      location,
      qualification,
      teaching_experience: teachingExperience,
      ministry_background: ministryBackground,
      preferred_courses: preferredCourses,
      availability,
      reason_for_applying: reasonForApplying,
      passport_url: passportUrl,
      application_status: "pending",
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/instructor/apply/success");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] px-6 py-20">
      <section className="mx-auto max-w-4xl border border-[#c9a84c]/20 bg-white/90 p-8">
        <p className="section-label">EDC Instructor Application</p>

        <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Apply as Instructor
        </h1>

        <p className="mt-4 max-w-3xl leading-8 text-[#1c2b3a]/70">
          Submit your teaching, ministry, and academic background for review by
          the EDC academic leadership.
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

          <input
            name="qualification"
            placeholder="Academic / Ministry Qualification"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <textarea
            name="teaching_experience"
            placeholder="Describe your teaching experience..."
            spellCheck={false}
            className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none transition"
          />

          <textarea
            name="ministry_background"
            placeholder="Describe your ministry background..."
            spellCheck={false}
            className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none transition"
          />

          <textarea
            name="preferred_courses"
            placeholder="Preferred courses or areas you can teach..."
            className="min-h-28 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <input
            name="availability"
            placeholder="Availability e.g. weekends, evenings, weekdays"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
          />

          <textarea
            name="reason_for_applying"
            required
            placeholder="Why do you want to serve as an EDC instructor?"
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
            Submit Instructor Application
          </button>
        </form>
      </section>
    </main>
  );
}