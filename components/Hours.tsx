import { hoursLines } from "@/lib/site";

/**
 * Opening hours with every time range LTR-isolated.
 *
 * Renders "א׳–ה׳ 07:00–18:00 · ו׳ 07:00–13:00" so the times read forwards. Interpolating
 * the bare string reverses each range to "18:00–07:00" under the bidi algorithm — see the
 * note on `hoursLines` in lib/site.ts. Inline by design (no wrapper element), so it drops
 * into a sentence as readily as into a list item.
 */
export default function Hours() {
  return (
    <>
      {hoursLines.map((line, i) => (
        <span key={line.days}>
          {i > 0 && " · "}
          {line.days} <span className="ltr">{line.time}</span>
        </span>
      ))}
    </>
  );
}
