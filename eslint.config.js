import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/"] },
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: globals.browser },
  },
  {
    files: ["tools/**/*.mjs", "tests/**/*.mjs", "eslint.config.js"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", globals: { ...globals.node, ...globals.browser } },
  },
];
