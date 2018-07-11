/**
 * This file is required by node, it should be valid node js code.
 * We keep the `.ts` extension to keep the types.
 */

const variables = {
  palette: {
    /* Primary colors */
    primary: {
      darkest: "#0D5B8F",
      dark: "#2B7EB5",
      main: "#3498DB",
      light: "#67B2E4",
      lighter: "#8DC5EB",
    },
    /* Secondary colors */
    secondary: {
      darkest: "#404345",
      dark: "#65696B",
      main: "#787D80",
      light: "#9A9DA0",
      lighter: "#636E72",
    },
    /* Success colors */
    success: {
      darkest: "#03AB61",
      dark: "#02BD6B",
      main: "#00CD73",
      light: "#40D996",
      lighter: "#83EBBD",
    },
    /* Error colors */
    error: {
      darkest: "#F50F0C",
      dark: "#FF1F1C",
      main: "#FA4643",
      light: "#F26563",
      lighter: "#F26563",
    },
    /* Text colors */
    text: {
      primary: "#3B4A53",
      secondary: "#787D80",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
    /* Common colors */
    common: {
      white: "#FFF",
      black: "#000",
    },
    /* Divider */
    divider: "rgba(0, 0, 0, 0.12)",
    /* The background colors used to style the surfaces. */
    background: {
      paper: "#FFF",
      default: "#FAFAFA",
    },
  },
  /* gitter and spacing */
  spacingUnit: 5,
  /* Borders */
  roundCorners: "2px",
  /* Typography */
  remBase: 16,
  fontFamily: '"Source Sans Pro"',
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 550,
  /* Breakpoints */
  breakpoints: {
    xs: 0,
    sm: 320,
    md: 640,
    lg: 1024,
    xl: 1400,
    xxl: 1600,
  },
};

module.exports = variables;
