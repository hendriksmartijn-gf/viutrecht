import Link from "next/link";
import { emojiFor, hrefFor, type LinkValue } from "./CtaLink";

// Pill buttons from the design. The disc on the right carries an emoji that says what the
// button does (🎁 trial, 🔥 VI Rise, 🏋️ a lesson...). Hover: every variant turns coral with ink
// text (white on coral fails contrast), lifts, glows and wiggles its emoji; the magnetic pull is
// added by Motion.tsx via [data-magnetic].
const VARIANTS = {
  // Light discs so the (often dark) emoji stay readable.
  primary: { button: "bg-primary text-white", disc: "bg-white" },
  primaryOnSand: { button: "bg-primary text-white", disc: "bg-white" },
  ghostDark: { button: "border border-ink/25 text-ink hover:border-coral", disc: "bg-lilac group-hover:bg-white" },
  ghostLight: { button: "border border-white/60 bg-white/8 text-white hover:border-coral", disc: "" },
  sun: { button: "bg-sun text-black", disc: "bg-white" },
} as const;

type Props = {
  link?: LinkValue;
  href?: string | null;
  label?: string | null;
  trialUrl?: string | null;
  // Overrides the emoji resolved from the link (e.g. a membership's own emoji).
  emoji?: string | null;
  variant?: keyof typeof VARIANTS;
  size?: "md" | "sm";
  arrow?: boolean;
  full?: boolean;
  // Stretches the click area over the nearest positioned ancestor (whole-card links).
  stretched?: boolean;
  className?: string;
};

export function Button({
  link,
  href: hrefProp,
  label: labelProp,
  trialUrl,
  emoji,
  variant = "primary",
  size = "md",
  arrow = variant !== "ghostLight",
  full,
  stretched,
  className = "",
}: Props) {
  const href = hrefProp ?? hrefFor(link, trialUrl);
  const label = labelProp ?? link?.label;
  if (!href || !label) return null;

  const v = VARIANTS[variant];
  const icon = emoji ?? emojiFor(link, href);
  const sizing =
    size === "sm"
      ? "gap-2.5 py-[5px] pl-4 pr-[5px] text-[14px] tracking-[-0.01em]"
      : arrow
        ? "gap-3.5 py-[7px] pl-[22px] pr-[7px] text-[15px] tracking-[-0.01em]"
        : "px-[22px] py-4 text-[15px] tracking-[-0.01em]";
  const classes = [
    "group inline-flex items-center rounded-full font-semibold whitespace-nowrap",
    "transition-[translate,box-shadow,background-color,color,border-color] duration-300 ease-out",
    "hover:bg-coral hover:text-ink hover:shadow-[0_12px_32px_-10px_rgba(248,105,87,0.8)]",
    "motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    full ? "w-full justify-center" : "",
    // A stretched link must not be the positioned ancestor of its own ::after.
    stretched
      ? "after:absolute after:inset-0 after:content-['']"
      : "",
    v.button,
    sizing,
    className,
  ].join(" ");
  const content = (
    <>
      {label}
      {arrow && (
        <span
          aria-hidden
          className={`flex shrink-0 items-center justify-center rounded-full transition-colors ${v.disc} ${size === "sm" ? "size-7 text-[12px]" : "size-[30px] text-[13px]"}`}
        >
          <span className="leading-none motion-safe:group-hover:animate-wiggle">{icon}</span>
        </span>
      )}
    </>
  );

  const element = href.startsWith("/") ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes} rel="noopener">
      {content}
    </a>
  );

  // The magnetic pull moves this wrapper, so it never fights the button's own hover transform.
  if (stretched) return element;
  return (
    <span data-magnetic className={full ? "flex w-full" : "inline-flex"}>
      {element}
    </span>
  );
}
