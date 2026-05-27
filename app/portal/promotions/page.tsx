import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentPromotionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: promotions, error } = await supabase
    .from("promotion_records")
    .select("*")
    .eq("student_id", user.id)
    .order("promoted_at", { ascending: false });

  return (
    <PortalShell
      title="Academic Promotions"
      subtitle="Track your academic progression and official level promotions within EDC Seminary."
    >
      <section className="border border-[#c9a84c]/20 bg-white/90 p-8">
        <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
          Promotion History
        </h2>

        {error && (
          <p className="mt-6 text-red-600">
            {error.message}
          </p>
        )}

        {!promotions || promotions.length === 0 ? (
          <p className="mt-8 text-[#1c2b3a]/70">
            No promotion history has been recorded yet.
          </p>
        ) : (
          <div className="mt-8 space-y-5">
            {promotions.map((promotion: any) => (
              <div
                key={promotion.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4]/90 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="section-label">
                      {promotion.academic_session}
                    </p>

                    <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
  {promotion.previous_level} / {promotion.previous_semester || "No semester"} →{" "}
  {promotion.promoted_level} / {promotion.promoted_semester || "No semester"}
</h3>
                  </div>

                  <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {promotion.promotion_status}
                  </span>
                </div>

                {promotion.remarks && (
                  <div className="mt-5 border border-[#c9a84c]/20 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#1c2b3a]/50">
                      Remarks
                    </p>

                    <p className="mt-3 leading-7 text-[#1c2b3a]/70">
                      {promotion.remarks}
                    </p>
                  </div>
                )}

                <p className="mt-5 text-sm text-[#1c2b3a]/55">
                  Promotion Date:{" "}
                  {promotion.promoted_at
                    ? new Date(
                        promotion.promoted_at
                      ).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}