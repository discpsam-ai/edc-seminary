import AdminSidebar from "@/components/AdminSidebar";
import BackButton from "./BackButton";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AdminShell({
  title,
  subtitle,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f3ec]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="px-6 py-10 lg:px-10">
          <div className="mb-10 border-b border-[#c9a84c]/20 pb-6">
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="section-label">EDC Admin Portal</p>

      <h1 className="mt-3 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-4 max-w-3xl leading-8 text-[#1c2b3a]/70">
          {subtitle}
        </p>
      )}
    </div>

    <BackButton />
  </div>
</div>

          {children}
        </main>
      </div>
    </div>
  );
}