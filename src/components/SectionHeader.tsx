type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      <p className="mb-3 text-sm font-semibold uppercase text-bearing-rust">
        {eyebrow}
      </p>
      <h2 className="text-balance text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-pretty text-base leading-7 text-slate-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
