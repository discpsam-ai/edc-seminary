type SectionHeaderProps = {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeader({
  label,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto mb-14 max-w-3xl text-center" : "mb-10 max-w-3xl"}>
      {label && <p className="section-label mb-4">{label}</p>}

      <div className={`gold-divider mb-6 ${isCenter ? "mx-auto" : ""}`} />

      <h2
        className={`font-edc-serif text-4xl font-semibold leading-tight md:text-5xl ${
          light ? "text-[#fdfaf4]" : "text-[#0b1f3a]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-6 text-base leading-8 ${
            light ? "text-[#fdfaf4]/65" : "text-[#1c2b3a]/70"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}