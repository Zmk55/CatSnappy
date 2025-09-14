/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "next/core-web-vitals",
  ],
  rules: {
    "prefer-const": "error",
    "no-var": "error",
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "out/",
    "dist/",
    "build/",
    "*.config.js",
    "*.config.cjs",
  ],
};

module.exports = config;
