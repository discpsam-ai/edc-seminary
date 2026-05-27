"use client";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  lessonId: string;
};

export default function CompleteLessonButton({ lessonId }: Props) {
  const [loading, setLoading] = useState(false);

  async function markCompleted() {
    setLoading(true);

    const response = await fetch(`/portal/learning/${lessonId}/complete`, {
      method: "POST",
    });

    setLoading(false);

    if (!response.ok) {
      toast.error("Could not mark lesson as completed.");
      return;
    }

    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={markCompleted}
      disabled={loading}
      className="border border-[#c9a84c]/30 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-[#0b1f3a]"
    >
      {loading ? "Saving..." : "Mark Completed"}
    </button>
  );
}