"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type SubmitAssignmentFormProps = {
  assignmentId: string;
  studentId: string;
};

export default function SubmitAssignmentForm({
  assignmentId,
  studentId,
}: SubmitAssignmentFormProps) {
  const supabase = createClient();

  const [submissionText, setSubmissionText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { data: assignment, error: assignmentError } = await supabase
      .from("assignments")
      .select("course_code")
      .eq("id", assignmentId)
      .single();

    if (assignmentError || !assignment) {
      toast.error("Assignment not found.");
      setLoading(false);
      return;
    }

    const { data: approvedRegistration, error: registrationError } =
      await supabase
        .from("course_registrations")
        .select("id")
        .eq("student_id", studentId)
        .eq("course_code", assignment.course_code)
        .eq("approval_status", "approved")
        .maybeSingle();

    if (registrationError) {
      toast.error(registrationError.message);
      setLoading(false);
      return;
    }

    if (!approvedRegistration) {
      toast.error(
        "You cannot submit this assignment because this course registration has not been approved for your account."
      );
      setLoading(false);
      return;
    }

    let fileUrl = "";

    if (file) {
      const filePath = `${studentId}/${assignmentId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("assignments")
        .upload(filePath, file);

      if (uploadError) {
       toast.error(uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("assignments")
        .getPublicUrl(filePath);

      fileUrl = data.publicUrl;
    }

    const submissionData: any = {
      assignment_id: assignmentId,
      student_id: studentId,
      submission_text: submissionText,
      submitted_at: new Date().toISOString(),
      status: "submitted",
    };

    if (fileUrl) {
      submissionData.file_url = fileUrl;
    }

    const { error } = await supabase
      .from("assignment_submissions")
      .upsert(submissionData, {
        onConflict: "assignment_id,student_id",
      });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

   toast.error("Assignment submitted/updated successfully.");
    setSubmissionText("");
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      <textarea
        value={submissionText}
        onChange={(e) => setSubmissionText(e.target.value)}
        placeholder="Write assignment response..."
        className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4"
      />

      <button type="submit" disabled={loading} className="btn-gold">
        {loading ? "Submitting..." : "Submit Assignment"}
      </button>
    </form>
  );
}