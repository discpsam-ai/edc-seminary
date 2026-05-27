import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: announcements, error } =
    await supabase
      .from("announcements")
      .select("*")
      .or(
        "audience.eq.all,audience.eq.students"
      )
      .order("created_at", {
        ascending: false,
      });

  return (
    <PortalShell
      title="Announcements"
      subtitle="Institutional notices, seminary updates, formation directives, and academic communication."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Institutional Communication
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Seminary Announcements
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Notices
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {announcements?.length || 0}
            </h3>
          </div>
        </div>

        {error && (
          <p className="mt-8 text-red-600">
            {error.message}
          </p>
        )}

        {!announcements ||
        announcements.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No announcement available yet.
          </p>
        ) : (
          <div className="mt-10 space-y-6">
            {announcements.map(
              (announcement: any) => (
                <div
                  key={announcement.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
                        {
                          announcement.title
                        }
                      </h3>

                      <p className="mt-5 leading-8 text-[#1c2b3a]/70">
                        {
                          announcement.message
                        }
                      </p>
                    </div>

                    <span className="border border-[#c9a84c]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]">
                      {
                        announcement.audience
                      }
                    </span>
                  </div>

                  <p className="mt-6 text-sm text-[#1c2b3a]/45">
                    Published on{" "}
                    {new Date(
                      announcement.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </PortalShell>
  );
}