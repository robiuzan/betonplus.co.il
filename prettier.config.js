/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  // 100 rather than the fleet's 90: this repo's existing JSX was authored wider, so a
  // narrower width would churn every file the Stop hook touches.
  printWidth: 100,
  tabWidth: 2,
  // Automatically sorts Tailwind utility classes in a consistent canonical order.
  // Tailwind v4: point the plugin at the CSS entry (@theme), not a JS config.
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
};
