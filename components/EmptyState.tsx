type EmptyStateProps = {
  title: string;

  description: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed border-[#c9a84c]/30 bg-[#fdfaf4] p-12 text-center">
      <h3 className="font-edc-serif text-3xl font-semibold text-[#0b1f3a]">
        {title}
      </h3>

      <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#1c2b3a]/70">
        {description}
      </p>
    </div>
  );
}