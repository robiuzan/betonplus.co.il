/**
 * Comparison table with its own horizontal scroll container, so a wide table never makes
 * the page body scroll sideways (responsive-accessibility skill). Header cells are real
 * <th scope> so the comparison is announced correctly.
 */
export default function CompareTable({
  caption,
  head,
  rows,
}: {
  caption?: string;
  head: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[36rem] border-collapse text-start">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-brand text-white">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="p-4 text-start font-heading text-sm font-bold sm:text-base"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row[0]} className="bg-white">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th
                    key={cell}
                    scope="row"
                    className="p-4 text-start align-top font-semibold text-brand"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={cell} className="p-4 align-top text-sm leading-relaxed text-ink/90">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
