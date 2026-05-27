import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export async function POST(_: Request, { params }: RouteProps) {
  const { lessonId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data: lesson } = await supabase
    .from("course_lessons")
    .select("course_code")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    return NextResponse.json(
      { error: "Lesson not found" },
      { status: 404 }
    );
  }

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      course_code: lesson.course_code,
      progress_status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "student_id,lesson_id",
    }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}