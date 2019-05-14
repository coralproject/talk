/*
  Variables defined in `variables.ts` are already available
  flattened and in kebab case.

  These are additionally variables we define.
*/

import flat from "flat";
import { kebabCase, mapKeys, mapValues, pickBy } from "lodash";

import variables from "./variables";

const flatKebabVariables = mapKeys(
  mapValues(flat(variables, { delimiter: "-" }), v => v.toString()),
  (_, k) => `--${kebabCase(k)}`
);

// These are the default css standard variables.
const cssVariables = pickBy(
  flatKebabVariables,
  (v, k) => !k.startsWith("breakpoints-")
);

const style = {
  ":root": {
    ...cssVariables,
    "--mini-unit": "calc(1px * var(--mini-unit-small))",
  },
  [`@media (min-width: ${variables.breakpoints.xs}px)`]: {
    ":root": {
      "--mini-unit": "calc(1px * var(--mini-unit-large))",
    },
  },
};

module.exports = style;
