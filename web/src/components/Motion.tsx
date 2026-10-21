"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Previously visited pages stay in the DOM while hidden (React Activity); leave them alone.
// They re-run their own effects, and so their animations, when shown again.
const rendered = <T extends Element>(selector: string) =>
  gsap.utils.toArray<T>(selector).filter((el) => el.getClientRects().length > 0);

// One controller for the whole page, driven by data attributes in the server-rendered HTML:
//   data-hero-item   entrance on load (text only; see globals.css for the pre-hydration state)
//   data-hero-media  slow scale-in, stays visible so it still counts for LCP;
//                    ="parallax" also drifts with the scroll (full-bleed heroes only)
//   data-reveal      fade up when scrolled into view
//   data-stagger     children fade up one after another
//   data-parallax    image drifts inside its frame while scrolling
//   data-slogan      footer wordmark slides along with the scroll
//   data-magnetic    buttons lean towards the cursor (mouse only)
// Rendered inside each page (not the layout), so it runs after that page has hydrated and
// remounts per navigation. Nothing runs with reduced motion.
export function Motion() {
  useGSAP(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hand the pre-hydration hidden state over to GSAP. The class must be set first: gsap.from()
      // animates towards the current computed style, which the CSS would otherwise pin at 0.
      // This runs in a layout effect, so the from-state is applied before the next paint.
      root.classList.add("motion-ready");
      const heroItems = rendered<HTMLElement>("[data-hero-item]");
      if (heroItems.length) {
        gsap.from(heroItems, { y: 36, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.05 });
      }

      rendered<HTMLElement>("[data-hero-media]").forEach((media) => {
        gsap.fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power2.out" });
        if (media.dataset.heroMedia !== "parallax") return;
        const section = media.closest("section, header") ?? media;
        gsap.to(media, { yPercent: 8, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
      });

      rendered<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 48, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      rendered<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      rendered<HTMLElement>("[data-parallax]").forEach((frame) => {
        const media = frame.querySelector("img");
        if (!media) return;
        gsap.fromTo(
          media,
          { yPercent: -8, scale: 1.18 },
          { yPercent: 8, scale: 1.18, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      rendered<HTMLElement>("[data-slogan]").forEach((el) => {
        gsap.fromTo(el, { xPercent: 6 }, { xPercent: -3, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true } });
      });
    });

    // Magnetic buttons: only with a real mouse, never on touch.
    mm.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      const cleanups = rendered<HTMLElement>("[data-magnetic]").map((el) => {
        const toX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const toY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const box = el.getBoundingClientRect();
          // Pull up to ~25% of the distance from the centre, capped so wide buttons stay calm.
          toX(gsap.utils.clamp(-10, 10, (event.clientX - (box.left + box.width / 2)) * 0.25));
          toY(gsap.utils.clamp(-6, 6, (event.clientY - (box.top + box.height / 2)) * 0.35));
        };
        const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    });

    // Reduced motion (or no match): make sure nothing stays hidden.
    root.classList.add("motion-ready");
    return () => mm.revert();
  });

  return null;
}
