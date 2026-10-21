type HeadingValue = { text?: string | null; emphasis?: string | null } | null | undefined;

// "Statement" + "emphasised continuation" render as one heading so the outline stays clean.
export function Heading({ value, as: Tag = "h2", className }: { value: HeadingValue; as?: "h1" | "h2" | "h3"; className?: string }) {
  if (!value?.text) return null;
  return (
    <Tag className={className}>
      {value.text}
      {value.emphasis ? (
        <>
          {" "}
          <em className="font-serif font-normal">{value.emphasis}</em>
        </>
      ) : null}
    </Tag>
  );
}

export const headingText = (value: HeadingValue) => [value?.text, value?.emphasis].filter(Boolean).join(" ");
