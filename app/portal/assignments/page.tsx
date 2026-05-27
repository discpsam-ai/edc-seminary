"use client";
import { toast } from "sonner";
import PortalShell from "@/components/PortalShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function PortalAssignmentsPage() {
  const supabase = createClient();

  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [uploading, setUploading] =
    useState<string | null>(null);

  async function loadAssignments() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: registrations } =
      await supabase
        .from("course_registrations")
        .select("course_id")
        .eq("student_id", user.id);

    const courseIds =
      registrations?.map(
        (item: any) => item.course_id
      ) || [];

    const { data } = await supabase
      .from("assignments")
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
      });

    setAssignments(data || []);
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  async function handleSubmission(
    assignmentId: string,
    file: File
  ) {
    setUploading(assignmentId);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("assignment-submissions")
        .upload(fileName, file);

    if (uploadError) {
      toast.error(uploadError.message);

      setUploading(null);

      return;
    }

    const { data } = supabase.storage
      .from("assignment-submissions")
      .getPublicUrl(fileName);

    await supabase
      .from("assignment_submissions")
      .insert({
        assignment_id: assignmentId,

        student_id: user.id,

        submission_url: data.publicUrl,
      });

   toast.success("Assignment submitted successfully");

    setUploading(null);
  }

  return (
    <PortalShell
      title="Assignments"
      subtitle="Access assignments, submit academic work, and monitor instructional deadlines."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-label">
              Academic Assignments
            </p>

            <h2 className="mt-3 font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
              Available Assignments
            </h2>
          </div>

          <div className="border border-[#c9a84c]/10 bg-[#fdfaf4] px-6 py-5">
            <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
              Total Assignments
            </p>

            <h3 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
              {assignments.length}
            </h3>
          </div>
        </div>

        {assignments.length === 0 ? (
          <p className="mt-10 text-[#1c2b3a]/70">
            No assignment available yet.
          </p>
        ) : (
          <div className="mt-10 space-y-5">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
              >
                <p className="section-label">
                  {
                    assignment.courses
                      ?.course_code
                  }
                </p>

                <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                  {assignment.title}
                </h3>

                <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                  {
                    assignment.instructions
                  }
                </p>

                <p className="mt-5 text-sm text-[#1c2b3a]/50">
                  Deadline:{" "}
                  {new Date(
                    assignment.deadline
                  ).toLocaleString()}
                </p>

                <div className="mt-6">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file =
                        e.target.files?.[0];

                      if (file) {
                        handleSubmission(
                          assignment.id,
                          file
                        );
                      }
                    }}
                    className="border border-[#c9a84c]/30 bg-white p-3"
                  />

                  {uploading ===
                    assignment.id && (
                    <p className="mt-3 text-sm text-[#c9a84c]">
                      Uploading submission...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}