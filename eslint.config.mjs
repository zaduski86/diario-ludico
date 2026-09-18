import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Math.random() inside useMemo/useState initializers is used deliberately
    // throughout the Three.js particle systems to seed stable, one-time
    // per-mount randomness (empty dependency arrays). The experimental
    // react-hooks/purity and set-state-in-effect rules can't verify that
    // statically, so they're disabled for this pattern.
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
