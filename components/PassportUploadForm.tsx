"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Props = {
  userId: string;
};

export default function PassportUploadForm({ userId }: Props) {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadPassport(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a passport image.");
      return;
    }

    setLoading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/passport-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("passports")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
     toast.error(uploadError.message);
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("passports")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
  .from("profiles")
  .update({
    passport_url: data.publicUrl,
    instructor_passport_url: data.publicUrl,
  })
  .eq("id", userId);
  
    setLoading(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success("Passport uploaded successfully.");
    window.location.reload();
  }

  return (
    <form onSubmit={uploadPassport} className="mt-6 grid gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-4"
      />

      <button type="submit" disabled={loading} className="btn-gold">
        {loading ? "Uploading..." : "Upload Passport"}
      </button>
    </form>
  );
}