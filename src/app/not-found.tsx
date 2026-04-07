import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-text-primary">
        404
      </h1>
      <p className="mt-3 text-text-secondary text-sm">
        This person doesn&apos;t exist yet.
      </p>
      <Link
        href="/praseeda"
        className="mt-6 text-xs text-text-accent hover:text-accent-gold-hover transition-colors uppercase tracking-widest"
      >
        Go to Circle13
      </Link>
    </main>
  );
}
