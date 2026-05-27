import AdminShell from "@/components/AdminShell";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminHandbookPage() {
  const supabase = await createClient();

  const { data: documents, error } = await supabase
    .from("institutional_documents")
    .select("*")
    .order("created_at", { ascending: false });

  async function addDocument(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const title = formData.get("title") as string;
    const documentType = formData.get("document_type") as string;
    const fileUrl = formData.get("file_url") as string;
    const documentStatus = formData.get("document_status") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("institutional_documents").insert({
      title,
      document_type: documentType,
      file_url: fileUrl,
      document_status: documentStatus,
      uploaded_by: user?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/handbook");
  }

  return (
    <AdminShell
      title="Handbook & Documents"
      subtitle="Manage institutional handbooks, downloadable documents, formation materials, and academic resources."
    >
      <section className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Institutional Documents
          </h2>

          {error && <p className="mt-6 text-red-600">{error.message}</p>}

          {!documents || documents.length === 0 ? (
            <p className="mt-8 text-[#1c2b3a]/70">
              No institutional document has been added yet.
            </p>
          ) : (
            <div className="mt-8 space-y-5">
              {documents.map((document: any) => (
                <div
                  key={document.id}
                  className="border border-[#c9a84c]/10 bg-[#fdfaf4] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="section-label">
                        {document.document_type || "Document"}
                      </p>

                      <h3 className="mt-3 font-edc-serif text-2xl font-semibold text-[#0b1f3a]">
                        {document.title}
                      </h3>

                      <p className="mt-2 break-all text-sm text-[#1c2b3a]/60">
                        {document.file_url || "No file link added"}
                      </p>
                    </div>

                    <span className="border border-[#c9a84c]/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {document.document_status || "published"}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-4">
                    {document.file_url ? (
                      <a
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold inline-block"
                      >
                        Open / Download
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Add New Document
          </h2>

          <form action={addDocument} className="mt-8 grid gap-5">
            <input
              name="title"
              required
              placeholder="Document Title"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              name="document_type"
              required
              defaultValue="handbook"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="handbook">Handbook</option>
              <option value="course material">Course Material</option>
              <option value="policy document">Policy Document</option>
              <option value="commissioning guide">Commissioning Guide</option>
            </select>

            <input
              name="file_url"
              required
              placeholder="Document file URL e.g. /documents/handbook.pdf"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            />

            <select
              name="document_status"
              required
              defaultValue="published"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <button type="submit" className="btn-gold">
              Add Document
            </button>
          </form>
        </div>
      </section>
    </AdminShell>
  );
}