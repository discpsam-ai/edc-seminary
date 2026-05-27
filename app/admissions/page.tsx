import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default function AdmissionPage() {
  async function submitApplication(formData: FormData) {
    "use server";

    const supabase = await createClient();

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

    const { error } = await supabase
      .from("admission_applications")
      .insert({
        full_name: formData.get("full_name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,

        gender: formData.get("gender") as string,
        date_of_birth: formData.get("date_of_birth") as string,

        address: formData.get("address") as string,
        state: formData.get("state") as string,
        country: formData.get("country") as string,

        previous_school: formData.get("previous_school") as string,
        educational_background: formData.get(
          "educational_background"
        ) as string,

        desired_level: formData.get("desired_level") as string,
        desired_semester: formData.get("desired_semester") as string,

        testimony: formData.get("testimony") as string,
        ministry_call: formData.get("ministry_call") as string,
        expectations: formData.get("expectations") as string,

        passport_url: passportUrl,

        application_status: "pending",

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admission/success");
  }

  return (
    <main className="min-h-screen bg-[#fdfaf4] px-6 py-16">
      <section className="mx-auto max-w-5xl border border-[#c9a84c]/20 bg-white/90 p-8">
        <p className="section-label">EDC Admission</p>

        <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
          Admission Application Form
        </h1>

        <p className="mt-4 max-w-3xl leading-8 text-[#1c2b3a]/70">
          Apply for admission into Ecclesia Discipleship & Commissioning.
        </p>

        <form
          action={submitApplication}
          className="mt-10 grid gap-5"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <input
              name="full_name"
              required
              placeholder="Full Name"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              name="gender"
              defaultValue=""
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              name="date_of_birth"
              type="date"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              name="state"
              placeholder="State"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              name="country"
              defaultValue="Nigeria"
              placeholder="Country"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              name="previous_school"
              placeholder="Previous School / Institution"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              name="desired_level"
              defaultValue="Level 1"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option>Level 1</option>
              <option>Level 2</option>
            </select>

            <select
              name="desired_semester"
              defaultValue="Semester 1"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
          </div>

          <textarea
            name="address"
            placeholder="Residential Address"
            className="min-h-28 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <textarea
            name="educational_background"
            placeholder="Educational Background"
            className="min-h-32 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <textarea
            name="testimony"
            placeholder="Briefly share your salvation testimony"
            className="min-h-36 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <textarea
            name="ministry_call"
            placeholder="Briefly describe your ministry call, burden, or spiritual journey"
            className="min-h-36 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <textarea
            name="expectations"
            placeholder="What do you expect from this training?"
            className="min-h-36 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
          />

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-[#0b1f3a]">
              Passport Photograph
            </label>

            <input
              type="file"
              name="passport"
              accept="image/*"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4"
            />
          </div>

          <button type="submit" className="btn-gold">
            Submit Application
          </button>
        </form>
      </section>
    </main>
  );
}