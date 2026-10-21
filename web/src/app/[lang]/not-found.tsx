import Link from "next/link";

// Rendered for unknown slugs. Bilingual because not-found has no access to params.
export default function NotFound() {
  return (
    <section className="py-24">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="mt-4">Deze pagina bestaat niet (meer). / This page doesn&apos;t exist (anymore).</p>
      <p className="mt-4">
        <Link href="/">Naar de homepage</Link> · <Link href="/en">Go to the homepage</Link>
      </p>
    </section>
  );
}
