import InstructorShell from "@/components/InstructorShell";

const students = [
  {
    name: "Boluwatife Raji",
    level: "Level 1",
    attendance: "96%",
    prayer: "92%",
    status: "Strong Progress",
  },
  {
    name: "Irene Emmanuel",
    level: "Level 1",
    attendance: "91%",
    prayer: "88%",
    status: "Good Progress",
  },
  {
    name: "Taiwo Esther",
    level: "Level 1",
    attendance: "85%",
    prayer: "79%",
    status: "Needs Encouragement",
  },
  {
    name: "Paul Oloko",
    level: "Level 1",
    attendance: "94%",
    prayer: "90%",
    status: "Strong Progress",
  },
];

export default function InstructorStudentsPage() {
  return (
    <InstructorShell
      title="Student Oversight"
      subtitle="Monitor student academic participation, prayer consistency, attendance, assignment responsibility, and formation progress."
    >
      <section className="border border-[#c9a84c]/20 bg-white p-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <input
            className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none"
            placeholder="Search student..."
          />

          <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
            <option>Filter by Level</option>
            <option>Level 1</option>
            <option>Level 2</option>
          </select>

          <select className="border border-[#c9a84c]/30 bg-[#fdfaf4] p-4 outline-none">
            <option>Filter by Status</option>
            <option>Strong Progress</option>
            <option>Good Progress</option>
            <option>Needs Encouragement</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#c9a84c]/20 text-left">
                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Student
                </th>
                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Level
                </th>
                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Attendance
                </th>
                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Prayer
                </th>
                <th className="pb-4 text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.name} className="border-b border-[#c9a84c]/10">
                  <td className="py-5 font-semibold text-[#0b1f3a]">
                    {student.name}
                  </td>
                  <td className="py-5 text-[#1c2b3a]/70">{student.level}</td>
                  <td className="py-5 text-[#1c2b3a]/70">{student.attendance}</td>
                  <td className="py-5 text-[#1c2b3a]/70">{student.prayer}</td>
                  <td className="py-5">
                    <span className="border border-[#c9a84c]/30 bg-[#fdfaf4] px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </InstructorShell>
  );
}