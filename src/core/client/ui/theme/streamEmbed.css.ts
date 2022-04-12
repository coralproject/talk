/*
  Variables defined in `variables.ts` are already available
  flattened and in kebab case.

  These are additionally variables we define.
*/

import flat from "flat";
import { kebabCase, mapKeys, mapValues } from "lodash";

import breakpoints from "./breakpoints";
import streamVariables from "./streamVariables";

const flatKebabVariables = mapKeys(
  mapValues(flat(streamVariables, { delimiter: "-" }), (v) => v.toString()),
  (_, k) => `--${kebabCase(k)}`
);

const cssObject = {
  ":global(#coral)": {
    all: "initial",
    ...flatKebabVariables,
    "--mini-unit": "calc(1px * var(--mini-unit-small))",
  },
  [`@media (min-width: ${breakpoints.xs}px)`]: {
    ":global(#coral)": {
      "--mini-unit": "calc(1px * var(--mini-unit-large))",
    },
  },
};

module.exports = cssObject;
