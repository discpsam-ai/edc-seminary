"use client";
import { toast } from "sonner";
import InstructorShell from "@/components/InstructorShell";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function InstructorMaterialsPage() {
  const supabase = createClient();

  const [courses, setCourses] =
    useState<any[]>([]);

  const [materials, setMaterials] =
    useState<any[]>([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [courseId, setCourseId] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: coursesData } =
      await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", user.id);

    setCourses(coursesData || []);

    const { data: materialsData } =
      await supabase
        .from("course_materials")
        .select(`
          *,
          courses:course_id (
            title,
            course_code
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    setMaterials(materialsData || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpload(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!file) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("course-materials")
        .upload(fileName, file);

    if (uploadError) {
      toast.error(uploadError.message);

      setLoading(false);

      return;
    }

    const { data } = supabase.storage
      .from("course-materials")
      .getPublicUrl(fileName);

    await supabase
      .from("course_materials")
      .insert({
        title,

        description,

        course_id: courseId,

        file_url: data.publicUrl,

        uploaded_by: user.id,
      });

    setTitle("");
    setDescription("");
    setCourseId("");
    setFile(null);

    await loadData();

    setLoading(false);
  }

  return (
    <InstructorShell
      title="Course Materials"
      subtitle="Upload lecture materials, institutional notes, handbooks, and downloadable learning resources."
    >
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Upload Material
          </h2>

          <form
            onSubmit={handleUpload}
            className="mt-8 grid gap-5"
          >
            <input
              type="text"
              required
              placeholder="Material Title"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              required
              value={courseId}
              onChange={(e) =>
                setCourseId(e.target.value)
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                >
                  {course.course_code} —{" "}
                  {course.title}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Material Description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <input
              type="file"
              required
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] || null
                )
              }
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
            >
              {loading
                ? "Uploading..."
                : "Upload Material"}
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Uploaded Materials
          </h2>

          {materials.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No material uploaded yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <p className="section-label">
                    {
                      material.courses
                        ?.course_code
                    }
                  </p>

                  <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                    {material.title}
                  </h3>

                  <p className="mt-4 leading-7 text-[#1c2b3a]/70">
                    {
                      material.description
                    }
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-[#1c2b3a]/45">
                      Uploaded on{" "}
                      {new Date(
                        material.created_at
                      ).toLocaleDateString()}
                    </p>

                    <a
                      href={material.file_url}
                      target="_blank"
                      className="btn-gold"
                    >
                      Open Material
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </InstructorShell>
  );
}