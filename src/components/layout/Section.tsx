export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* iOS grouped list header — 13px, uppercase, secondaryLabel, left padded */}
      <p
        className="text-[13px] font-normal uppercase mb-2 px-5"
        style={{ letterSpacing: "-0.08px", color: "rgba(235, 235, 245, 0.3)" }}
      >
        {title}
      </p>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}
