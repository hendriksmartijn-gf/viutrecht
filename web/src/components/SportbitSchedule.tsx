"use client";

import Script from "next/script";

// VI's live schedule, embedded from Sportbit (their embed code, as a component). The schedule
// itself is not in Sanity: Sportbit fills #sportbit-rooster and handles booking in its popup.
const SPORTBIT = "https://viutrecht.sportbitapp.nl/";
const SCHEDULE_ID = 1;

declare global {
  interface Window {
    embed_rooster?: { init: (uri: string, roosterId?: number) => void };
  }
}

export function SportbitSchedule() {
  return (
    <>
      {/* React hoists this to <head> and loads it once. */}
      <link rel="stylesheet" href={`${SPORTBIT}cbm/css/embed/rooster/rooster.css`} precedence="default" />
      {/* onReady also runs when you come back to the page later, so the schedule is filled again. */}
      <Script src={`${SPORTBIT}cbm/embed/rooster/cdn/`} strategy="afterInteractive" onReady={() => window.embed_rooster?.init(SPORTBIT, SCHEDULE_ID)} />
      <div className="overflow-x-auto">
        {/* Sportbit switches to a one-day list on small screens by itself. */}
        <div id="sportbit-rooster" className="min-h-[60vh]" />
      </div>
    </>
  );
}
