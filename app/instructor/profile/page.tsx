import InstructorShell from "@/components/InstructorShell";
import PassportUploadForm from "@/components/PassportUploadForm";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function InstructorProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      role,
      instructor_number,
      instructor_bio,
      teaching_qualification,
      instructor_passport_url,
      passport_url
    `)
    .eq("id", user.id)
    .single();

  async function updateInstructorProfile(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const phone = formData.get("phone") as string;
    const instructorBio = formData.get("instructor_bio") as string;
    const teachingQualification = formData.get(
      "teaching_qualification"
    ) as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { error } = await supabase
      .from("profiles")
      .update({
        phone,
        instructor_bio: instructorBio,
        teaching_qualification: teachingQualification,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/instructor/profile");
  }

  return (
    <InstructorShell
      title="Instructor Profile"
      subtitle="Manage your instructor identity, teaching profile, passport, and institutional record."
    >
      <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <div className="mx-auto flex h-[260px] max-w-[220px] items-center justify-center overflow-hidden border border-[#c9a84c]/20 bg-[#f7f3ec]/90 p-3">
            {profile?.instructor_passport_url || profile?.passport_url ? (
              <Image
                src={profile.instructor_passport_url || profile.passport_url}
                alt="Instructor Passport"
                width={400}
                height={500}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/40">
                Passport
              </div>
            )}
          </div>

          <PassportUploadForm userId={user.id} />

          <div className="mt-8 text-center">
            <h2 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
              {profile?.full_name || "Instructor"}
            </h2>

            <p className="mt-3 text-sm uppercase tracking-[0.15em] text-[#c9a84c]">
              EDC Instructor
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {[
              ["Instructor ID", profile?.instructor_number || "Not assigned"],
              ["Email", profile?.email || "Not available"],
              ["Phone", profile?.phone || "Not provided"],
              ["Role", profile?.role || "instructor"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  {label}
                </p>

                <h3 className="mt-2 text-[#0b1f3a]">{value}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white/90 p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Update Teaching Profile
          </h2>

          <form action={updateInstructorProfile} className="mt-8 grid gap-5">
            <input
              name="phone"
              defaultValue={profile?.phone || ""}
              placeholder="Phone Number"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <input
              name="teaching_qualification"
              defaultValue={profile?.teaching_qualification || ""}
              placeholder="Teaching / Ministry Qualification"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <textarea
              name="instructor_bio"
              defaultValue={profile?.instructor_bio || ""}
              placeholder="Instructor Bio"
              className="min-h-44 border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4 outline-none"
            />

            <button type="submit" className="btn-gold">
              Update Profile
            </button>
          </form>
        </div>
      </section>
    </InstructorShell>
  );
}