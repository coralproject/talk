import colors from "./colors";
import { compat } from "./compatibility";
import sharedVariables from "./sharedVariables";

const streamVariables = {
  ...sharedVariables,
  palette: {
    ...sharedVariables.palette,
    /** Color palette that is used as the primary color. */
    primary: {
      100: compat(colors.streamBlue100, "palette-primary-lightest"),
      200: compat(colors.streamBlue200, "palette-primary-lighter"),
      300: compat(colors.streamBlue300, "palette-primary-light"),
      400: compat(colors.streamBlue400, "palette-primary-main"),
      500: compat(colors.streamBlue500, "palette-primary-main"),
      600: compat(colors.streamBlue600, "palette-primary-main"),
      700: compat(colors.streamBlue700, "palette-primary-main"),
      800: compat(colors.streamBlue800, "palette-primary-dark"),
      900: compat(colors.streamBlue900, "palette-primary-darkest"),
    },
  },
};

export default streamVariables;
