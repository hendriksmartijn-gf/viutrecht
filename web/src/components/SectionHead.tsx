type HeadingValue = { eyebrow?: string | null; text?: string | null; emphasis?: string | null } | null | undefined;

type Props = {
  heading: HeadingValue;
  number?: number;
  size?: "lg" | "md";
  // Puts the serif continuation on its own line, as in "Mensen die / hun gym vonden."
  stacked?: boolean;
  className?: string;
};

// "[ 01 ] Label" above a bold statement with a serif italic continuation.
export function SectionHead({ heading, number, size = "lg", stacked, className = "" }: Props) {
  if (!heading?.text) return null;
  const sizes =
    size === "lg"
      ? "text-[clamp(36px,4.45vw,64px)] tracking-[-0.04em] [&_em]:text-[1.078em]"
      : "text-[clamp(36px,3.9vw,56px)] tracking-[-0.04em] [&_em]:text-[1.071em]";
  return (
    <div data-reveal className={`flex flex-col gap-3.5 md:gap-5 ${className}`}>
      {heading.eyebrow && (
        <p className="eyebrow text-ink/55">
          {number ? `[ ${String(number).padStart(2, "0")} ] ` : ""}
          {heading.eyebrow}
        </p>
      )}
      <h2 className={`font-bold leading-[0.98] text-ink md:leading-[0.96] ${sizes}`}>
        {heading.text}
        {heading.emphasis && (
          <>
            {stacked ? <br /> : " "}
            <em className="display-emphasis">{heading.emphasis}</em>
          </>
        )}
      </h2>
    </div>
  );
}
