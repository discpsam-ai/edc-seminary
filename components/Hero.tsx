import Link from "next/link";

type HeroProps = {
  label?: string;
  title: string;
  subtitle?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
};

export default function Hero({
  label,
  title,
  subtitle,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: HeroProps) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-visible bg-gradient-to-br from-[#071528] via-[#0b1f3a] to-[#132d52] px-6 pt-28 pb-36 text-center text-[#fdfaf4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.16),transparent_30%),radial-gradient(circle_at_80%_60%,rgba(201,168,76,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {label && <p className="section-label mb-5">{label}</p>}

        <div className="gold-divider mx-auto mb-8" />

        <h1 className="font-edc-serif text-5xl font-semibold leading-tight md:text-7xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-[#fdfaf4]/70 md:text-lg">
            {subtitle}
          </p>
        )}

        {(primaryText || secondaryText) && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {primaryText && primaryHref && (
              <Link href={primaryHref} className="btn-gold">
                {primaryText}
              </Link>
            )}

            {secondaryText && secondaryHref && (
              <Link href={secondaryHref} className="btn-outline">
                {secondaryText}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}