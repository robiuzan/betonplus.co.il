/**
 * Build-gate assertion: no rendered <title> may carry the brand twice.
 *
 * Why this exists (backlog §2.3, roadmap 2.8). There are two title mechanisms in this
 * repo and combining them silently doubles the brand:
 *
 *   1. The root `template` in app/layout.tsx appends " | בטון פלוס" to a page's own title.
 *   2. Service pages pass `absoluteTitle: true` with a `metaTitle` that ALREADY carries
 *      the brand, which bypasses the template.
 *
 * A new page that copies the wrong sibling gets "… | בטון פלוס | בטון פלוס". That shipped
 * once on /about/ (fixed 2026-08-17) and is invisible in review — it only shows up in the
 * SERP. This runs as `postbuild`, so the regression fails `npm run build` instead.
 *
 * Runs against the static export in out/. No dependencies.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const BRAND = "בטון פלוס";

/**
 * Titles that legitimately repeat across routes. `/404/` and `/_not-found/` inherit the
 * layout default, so the homepage title renders three times and Next's built-in
 * not-found title renders twice. Neither is a duplicate-content problem.
 */
const ALLOWED_DUPLICATE_COUNT = new Map([["404: This page could not be found.", 2]]);

if (!existsSync(OUT)) {
  console.error(`check-titles: ${OUT}/ not found — run the build first.`);
  process.exit(1);
}

/** Every index.html in the export, as route paths. */
function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name === "index.html") yield full;
  }
}

const titleOf = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;
const countBrand = (title) => title.split(BRAND).length - 1;

const routeOf = (file) => {
  const rel = relative(OUT, file).split(sep).slice(0, -1).join("/");
  return rel ? `/${rel}/` : "/";
};

const doubled = [];
const missing = [];
const byTitle = new Map();

for (const file of htmlFiles(OUT)) {
  const route = routeOf(file);
  const title = titleOf(readFileSync(file, "utf8"));

  if (title === null) {
    missing.push(route);
    continue;
  }
  if (countBrand(title) > 1) doubled.push({ route, title });
  byTitle.set(title, [...(byTitle.get(title) ?? []), route]);
}

// Duplicates beyond the known layout-inheritance cases.
const homepageTitle = titleOf(readFileSync(join(OUT, "index.html"), "utf8"));
if (homepageTitle) ALLOWED_DUPLICATE_COUNT.set(homepageTitle, 3);

const duplicates = [...byTitle.entries()].filter(
  ([title, routes]) => routes.length > (ALLOWED_DUPLICATE_COUNT.get(title) ?? 1),
);

for (const { route, title } of doubled) {
  console.error(`✖ doubled brand  ${route}\n    ${title}`);
}
for (const route of missing) {
  console.error(`✖ missing <title>  ${route}`);
}
for (const [title, routes] of duplicates) {
  console.error(`✖ duplicate title across ${routes.length} routes: ${title}\n    ${routes.join(", ")}`);
}

if (doubled.length || missing.length || duplicates.length) {
  console.error(
    "\ncheck-titles FAILED. A page's own title must never append the brand when the " +
      "layout template already does — see CLAUDE.md §8 and the seo-metadata skill.",
  );
  process.exit(1);
}

console.log(`check-titles: ${byTitle.size} unique titles across the export, brand appears once each.`);
