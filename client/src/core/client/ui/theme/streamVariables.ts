import { compat } from "./compatibility";
import sharedVariables from "./sharedVariables";

const streamVariables = {
  ...sharedVariables,
  palette: {
    ...sharedVariables.palette,
    /** Color palette that is used as the primary color. */
    primary: {
      100: compat("#78716C", "palette-primary-lightest"),
      200: compat("#57534E", "palette-primary-lighter"),
      300: compat("#292524", "palette-primary-light"),
      400: compat("#1C1917", "palette-primary-main"),
      500: compat("#1C1917", "palette-primary-main"),
      600: compat("#1C1917", "palette-primary-main"),
      700: compat("#1C1917", "palette-primary-main"),
      800: compat("#1C1917", "palette-primary-dark"),
      900: compat("#1C1917", "palette-primary-darkest"),
    },
    highlight: {
      100: compat("#FDFCE8", "palette-highlight-lightest"),
      200: compat("#FDFCE8", "palette-highlight-lighter"),
      300: compat("#FDFCE8", "palette-highlight-light"),
      400: compat("#FFEB2D", "palette-highlight-main"),
      500: compat("#FFEB2D", "palette-highlight-main"),
      600: compat("#FFEB2D", "palette-highlight-main"),
      700: compat("#FFEB2D", "palette-highlight-main"),
      800: compat("#FFEB2D", "palette-highlight-dark"),
      900: compat("#FFEB2D", "palette-highlight-darkest"),
    },
    "warm-gray": {
      100: compat("#F5F5F4", "palette-warm-gray-lightest"),
      200: compat("#E7E5E4", "palette-warm-gray-lighter"),
      300: compat("#D6D3D1", "palette-warm-gray-light"),
      400: compat("#A8A29E", "palette-warm-gray-main"),
      500: compat("#78716C", "palette-warm-gray-main"),
      600: compat("#57534E", "palette-warm-gray-main"),
      700: compat("#44403C", "palette-warm-gray-main"),
      800: compat("#292524", "palette-warm-gray-dark"),
      900: compat("#1C1917", "palette-warm-gray-darkest"),
    },
    action: {
      "000": compat("#1A6EF4", "palette-action"),
    },
  },
};

export default streamVariables;
