// Escapes "<" so content can never close the script tag (XSS), per the Next.js JSON-LD guide.
export function JsonLd({ data }: { data: object | object[] | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
