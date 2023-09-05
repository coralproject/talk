import colors from "./colors";
import sharedVariables from "./sharedVariables";

const adminVariables = {
  ...sharedVariables,
  palette: {
    ...sharedVariables.palette,
    primary: {
      100: colors.teal100,
      200: colors.teal200,
      300: colors.teal300,
      400: colors.teal400,
      500: colors.teal500,
      600: colors.teal600,
      700: colors.teal700,
      800: colors.teal800,
      900: colors.teal900,
    },
  },
};

export default adminVariables;
