// Server-rendered JSON-LD structured data (crawler-visible in the static HTML).
// Pass a plain schema object; it is serialized into a <script type="application/ld+json">.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema is built from our own constants (no user input) — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
