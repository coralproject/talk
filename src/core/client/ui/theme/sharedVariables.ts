/**
 * This file is required by node, it should be valid node js code.
 * We keep the `.ts` extension to keep the types.
 */

import colors from "./colors";
import { compat } from "./compatibility";

const variables = {
  /** Use this to remove round corners or make them more round. */
  roundCorners: "3px",
  /** Different color palettes currently in use. */
  palette: {
    /** Color palette that is used for background colors. */
    background: {
      body: colors.pure.white,
      popover: colors.pure.white,
      tooltip: colors.grey500,
      input: colors.pure.white,
      inputDisabled: colors.white500,
    },
    /** Color palette that is used for text. */
    text: {
      "000": compat(colors.pure.white, "palette-text-light"),
      100: compat(colors.mono100, "palette-text-secondary"),
      500: compat(colors.mono500, "palette-text-primary"),
      900: compat(colors.mono900, "palette-text-dark"),
      placeholder: compat(colors.grey400, "palette-grey-lighter"),
      inputDisabled: compat(colors.grey400, "palette-grey-lighter"),
    },
    /** Color palette that is used for grey shades. */
    grey: {
      100: compat(colors.grey100, "palette-grey-lightest"),
      200: compat(colors.grey200, "palette-grey-lightest"),
      300: compat(colors.grey300, "palette-grey-lighter"),
      400: compat(colors.grey400, "palette-grey-lighter"),
      500: compat(colors.grey500, "palette-grey-main"),
      600: compat(colors.grey600, "palette-grey-dark"),
      700: compat(colors.grey700, "palette-grey-darkest"),
      800: compat(colors.grey800, "palette-grey-darkest"),
      900: compat(colors.grey900, "palette-grey-darkest"),
    },
    /** Color palette that is used for indicating something is error red. */
    error: {
      100: compat(colors.red100, "palette-error-lightest"),
      200: compat(colors.red200, "palette-error-lighter"),
      300: compat(colors.red300, "palette-error-lighter"),
      400: compat(colors.red400, "palette-error-light"),
      500: compat(colors.red500, "palette-error-main"),
      600: compat(colors.red600, "palette-error-main"),
      700: compat(colors.red700, "palette-error-dark"),
      800: compat(colors.red800, "palette-error-darkest"),
      900: compat(colors.red900, "palette-error-darkest"),
    },
    /** Color palette that is used for indicating something is success green. */
    success: {
      100: compat(colors.green100, "palette-success-lightest"),
      200: compat(colors.green200, "palette-success-lighter"),
      300: compat(colors.green300, "palette-success-lighter"),
      400: compat(colors.green400, "palette-success-light"),
      500: compat(colors.green500, "palette-success-main"),
      600: compat(colors.green600, "palette-success-main"),
      700: compat(colors.green700, "palette-success-dark"),
      800: compat(colors.green800, "palette-success-darkest"),
      900: compat(colors.green900, "palette-success-darkest"),
    },
    /** Color palette that is used for indicating a warning and is usually yellow. */
    warning: {
      100: compat(colors.yellow100, "palette-warning-main"),
      500: compat(colors.yellow500, "palette-warning-main"),
      900: compat(colors.yellow900, "palette-warning-main"),
    },
    divider: "rgba(0, 0, 0, 0.12)",
  },
  /** Different font families currently in use. */
  fontFamily: {
    primary: compat('"Open Sans", sans-serif', "font-family-sans-serif"),
    secondary: compat('"Nunito"', "font-family-serif"),
  },
  /** Different font weights with matching values for the fonts. */
  fontWeight: {
    primary: {
      bold: compat("700", "font-weight-bold"),
      semiBold: compat("600", "font-weight-medium"),
      regular: compat("300", "font-weight-light"),
    },
    secondary: {
      bold: compat("700", "font-weight-bold"),
      regular: compat("300", "font-weight-light"),
    },
  },
  fontSize: {
    1: "0.75rem",
    2: "0.875rem",
    3: "1rem",
    4: "1.125rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    iconXl: "2.25rem",
    iconLg: "1.5rem",
    iconMd: "1.125rem",
    iconSm: "0.875rem",
    iconXs: "0.75rem",
  },
  /** Different shadows that are currently used in Coral. */
  shadow: {
    popover: compat("1px 0px 4px rgba(0, 0, 0, 0.25)", "elevation-main"),
  },
  /** Different spacing units currenty used in Coral. */
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "24px",
    6: "32px",
    7: "44px",
    8: "60px",
    9: "84px",
  },
  /** Grid units for smaller and larger screens. */
  miniUnit: {
    small: 4,
    large: 8,
  },
};

export type Spacing = keyof typeof variables["spacing"];
export default variables;
