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
      100: compat("#FDFCE8", "palette-primary-lightest"),
      200: compat("#FDFCE8", "palette-primary-lighter"),
      300: compat("#FDFCE8", "palette-primary-light"),
      400: compat("#FFEB2D", "palette-primary-main"),
      500: compat("#FFEB2D", "palette-primary-main"),
      600: compat("#FFEB2D", "palette-primary-main"),
      700: compat("#FFEB2D", "palette-primary-main"),
      800: compat("#FFEB2D", "palette-primary-dark"),
      900: compat("#FFEB2D", "palette-primary-darkest"),
    },
  },
};

export default streamVariables;
