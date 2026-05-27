import AdminShell from "@/components/AdminShell";

export default function AdminSettingsPage() {
  return (
    <AdminShell
      title="Institution Settings"
      subtitle="Manage institutional identity, academic session settings, portal configuration, and administrative controls."
    >
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Institutional Information
          </h2>

          <form className="mt-8 grid gap-5">
            <input
              defaultValue="Ecclesia Discipleship & Commissioning"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Institution Name"
            />

            <input
              defaultValue="Awakening Ecclesia"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Parent Ministry"
            />

            <input
              defaultValue="2026 Academic Session"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Academic Session"
            />

            <input
              defaultValue="Semester 1"
              className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Current Semester"
            />

            <button type="submit" className="btn-gold">
              Save Settings
            </button>
          </form>
        </div>

        <div className="border border-[#c9a84c]/20 bg-white p-8">
          <h2 className="font-edc-serif text-4xl font-semibold text-[#0b1f3a]">
            Portal Configuration
          </h2>

          <form className="mt-8 grid gap-5">
            <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
              <option>Admissions Status</option>
              <option>Open</option>
              <option>Closed</option>
            </select>

            <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
              <option>Portal Access</option>
              <option>Enabled</option>
              <option>Disabled</option>
            </select>

            <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
              <option>Commissioning Access</option>
              <option>Enabled</option>
              <option>Restricted</option>
            </select>

            <textarea
              defaultValue="Institutional settings and configuration controls for EDC."
              className="min-h-40 border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
              placeholder="Administrative Notes"
            />

            <button type="submit" className="btn-gold">
              Update Configuration
            </button>
          </form>
        </div>
      </section>
    </AdminShell>
  );
}