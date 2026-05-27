"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type UploadCourseMaterialProps = {
  courseId: string;
  courseCode: string;
};

export default function UploadCourseMaterial({
  courseId,
  courseCode,
}: UploadCourseMaterialProps) {
  const supabase = createClient();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    setLoading(true);

    const safeCode = courseCode.replaceAll(" ", "-");
    const filePath = `${safeCode}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("course-materials")
      .upload(filePath, file);

    if (uploadError) {
      toast.error(uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("course-materials")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from("courses")
      .update({ material_url: data.publicUrl })
      .eq("id", courseId);

    setLoading(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.error("Course material uploaded successfully.");
    setFile(null);
    router.refresh();
  }

  return (
    <form onSubmit={handleUpload} className="mt-6 grid gap-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4"
      />

      <button type="submit" disabled={loading} className="btn-gold">
        {loading ? "Uploading..." : "Upload Material"}
      </button>
    </form>
  );
}