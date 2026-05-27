type MetricCardProps = {
  label: string;

  value: string | number;

  subtitle?: string;
};

export default function MetricCard({
  label,
  value,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="border border-[#c9a84c]/20 bg-white p-8">
      <p className="text-sm uppercase tracking-[0.15em] text-[#1c2b3a]/45">
        {label}
      </p>

      <h2 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
        {value}
      </h2>

      {subtitle && (
        <p className="mt-4 text-[#1c2b3a]/70">
          {subtitle}
        </p>
      )}
    </div>
  );
}