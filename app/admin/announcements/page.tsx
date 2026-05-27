import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient();

  const { data: announcements, error } =
    await supabase
      .from("announcements")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  async function createAnnouncement(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const title =
      formData.get("title") as string;

    const message =
      formData.get("message") as string;

    const audience =
      formData.get("audience") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("announcements")
      .insert({
        title,
        message,
        audience,
        created_by: user?.id,
      });

    revalidatePath(
      "/admin/announcements"
    );
  }

  return (
    <AdminShell
      title="Announcements"
      subtitle="Create institutional announcements, notices, and administrative communications."
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Published Announcements
          </h2>

          {error && (
            <p className="mt-6 text-red-600">
              {error.message}
            </p>
          )}

          {!announcements ||
          announcements.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No announcement published yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {announcements.map(
                (announcement: any) => (
                  <div
                    key={announcement.id}
                    className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                          {
                            announcement.title
                          }
                        </h3>

                        <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                          {
                            announcement.message
                          }
                        </p>

                        <p className="mt-4 text-sm text-[#1c2b3a]/50">
                          Audience:{" "}
                          {
                            announcement.audience
                          }
                        </p>

                        <p className="mt-3 text-sm text-[#1c2b3a]/45">
                          {new Date(
                            announcement.created_at
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                        Published
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Create Announcement
          </h2>

          <form
            action={createAnnouncement}
            className="mt-8 grid gap-5"
          >
            <input
              type="text"
              name="title"
              required
              placeholder="Announcement Title"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              name="audience"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="all">
                Institution Wide
              </option>

              <option value="students">
                Students
              </option>

              <option value="instructors">
                Instructors
              </option>
            </select>

            <textarea
              required
              name="message"
              placeholder="Write announcement..."
              className="min-h-52 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <button
              type="submit"
              className="btn-gold"
            >
              Publish Announcement
            </button>
          </form>
        </div>
      </section>
    </AdminShell>
  );
}