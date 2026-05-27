import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function MaterialsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: registrations } =
    await supabase
      .from("course_registrations")
      .select("course_id")
      .eq("student_id", user.id);

  const courseIds =
    registrations?.map(
      (item: any) => item.course_id
    ) || [];

  const { data: materials, error } =
    courseIds.length > 0
      ? await supabase
          .from("course_materials")
          .select(`
            *,
            courses:course_id (
              title,
              course_code
            )
          `)
          .in("course_id", courseIds)
          .order("created_at", {
            ascending: false,
          })
      : {
          data: [],
          error: null,
        };

  return (
    <PortalShell
      title="Course Materials"
      subtitle="Download lecture materials, seminary manuals, academic notes, and institutional learning resources."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Learning Repository
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Academic Materials
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Available Materials
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {materials?.length || 0}
            </h3>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!materials ||
        materials.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No academic material available yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {materials.map(
              (material: any) => (
                <div
                  key={material.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6"
                >
                  <p className="section-label">
                    {
                      material.courses
                        ?.course_code
                    }
                  </p>

                  <h3 className="mt-3 font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                    {material.title}
                  </h3>

                  <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                    {
                      material.description
                    }
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#1c2b3a]/45">
                        Uploaded:
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#0b1f3a]">
                        {new Date(
                          material.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <a
                      href={
                        material.file_url
                      }
                      target="_blank"
                      className="btn-gold"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </PortalShell>
  );
}