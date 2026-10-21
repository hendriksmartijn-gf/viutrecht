import { RichText } from "./RichText";

type Faq = { _id: string; question?: string | null; answer?: readonly object[] | null } | null;

type Props = {
  faqs: Faq[] | null | undefined;
  numbered?: boolean;
  // Lesson pages: larger questions with the first answer open.
  size?: "md" | "lg";
  openFirst?: boolean;
};

// Native <details>: answers are in the HTML for crawlers and work without JavaScript.
export function Faqs({ faqs, numbered, size = "md", openFirst }: Props) {
  if (!faqs?.length) return null;
  return (
    <div data-stagger className="flex flex-col gap-2">
      {faqs.map((faq, i) =>
        faq ? (
          <details key={faq._id} open={openFirst && i === 0} className="group rounded-[20px] border border-ink/7 bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-3 py-[18px] pl-5 pr-[18px] leading-[normal] md:gap-1 md:px-[25px] md:py-[22px]">
              <span className="flex items-center gap-5">
                {numbered && <span className="eyebrow hidden text-ink/40 md:inline">{String(i + 1).padStart(2, "0")}</span>}
                <span className={`font-medium tracking-[-0.01em] group-open:font-semibold ${size === "lg" ? "text-[17px] md:text-[20px]" : "text-[15px] md:text-[18px]"}`}>
                  {faq.question}
                </span>
              </span>
              <span aria-hidden className="text-[22px] text-ink/60 group-open:text-ink md:text-[24px]">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">–</span>
              </span>
            </summary>
            <div className={`-mt-2 px-5 pb-[18px] text-[15px] leading-[1.55] text-ink/70 md:px-[25px] md:pb-[22px] md:text-[16px] ${numbered ? "md:pl-[61px]" : ""} [&_p]:max-w-[560px]`}>
              <RichText value={faq.answer} />
            </div>
          </details>
        ) : null,
      )}
    </div>
  );
}
