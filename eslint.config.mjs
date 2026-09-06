import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build artifacts and rollback copies.
    "out.prev/**",
    // Vendored third-party assets. public/cdn-cgi/** is Cloudflare's own minified
    // JS and accounts for every error this config used to report; none of it is
    // ours to fix, and linting it made `npm run lint` unusable as a release gate.
    "public/**",
    "vendor/**",
    // scripts/check-titles.mjs (the postbuild title gate) is deliberately NOT ignored:
    // the WordPress snapshot layer that once lived here was deleted in 58d0749.
  ]),
]);

export default eslintConfig;
