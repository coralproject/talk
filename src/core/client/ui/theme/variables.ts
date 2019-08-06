/**
 * This file is required by node, it should be valid node js code.
 * We keep the `.ts` extension to keep the types.
 */

export type Spacing = keyof typeof variables["spacing"];
export type Shade = keyof typeof variables["palette"]["primary"];

const variables = {
  elevation: {
    main: "1px 0px 4px rgba(0, 0, 0, 0.25)",
  },
  palette: {
    /* Primary colors */
    primary: {
      darkest: "#0D5B8F",
      dark: "#2B7EB5",
      main: "#3498DB",
      light: "#67B2E4",
      lighter: "#8DC5EB",
      lightest: "#EBF5FB",
    },
    /* Secondary colors */
    grey: {
      darkest: "#404345",
      dark: "#65696B",
      main: "#787D80",
      light: "#9A9DA0",
      lighter: "#BBBEBF",
      lightest: "#F5F5F5",
    },
    /* Success colors */
    success: {
      darkest: "#03AB61",
      dark: "#02BD6B",
      main: "#00CD73",
      light: "#40D996",
      lighter: "#83EBBD",
      lightest: "#E6FAF1",
    },
    /* Error colors */
    error: {
      darkest: "#F50F0C",
      dark: "#FF1F1C",
      main: "#FA4643",
      light: "#FB7472",
      lighter: "#FC9795",
      lightest: "#FEF0EF",
    },
    /* Warning colors */
    warning: {
      main: "#DC8400",
    },
    /* Text colors */
    text: {
      primary: "#3B4A53",
      secondary: "#787D80",
      light: "#fff",
    },
    /* Background colors */
    background: {
      light: "#F6F6F6",
    },
    /* Common colors */
    common: {
      white: "#FFF",
      black: "#000",
    },
    /* Divider */
    divider: "rgba(0, 0, 0, 0.12)",
    highlight: "#FFD863",
    brand: {
      main: "#f77160",
      light: "#f97f70",
      lighter: "#fc9e92",
    },
  },
  /* gitter and spacing */
  miniUnitSmall: 4,
  miniUnitLarge: 8,
  /* Borders */
  roundCorners: "2px",
  /* Typography */
  remBase: 16,
  fontFamilySansSerif: '"Source Sans Pro"',
  fontFamilySerif: '"Manuale"',
  /** Deprecated */
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  /***************/
  fontSize: {
    1: "12px",
    2: "14px",
    3: "16px",
    4: "18px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
  },
  fontWeight: {
    sans: {
      regular: 400,
      medium: 600,
      bold: 700,
    },
    serif: {
      regular: 400,
      medium: 600,
      bold: 600,
    },
  },
  lineHeight: {
    1: "1.1em",
    2: "1.2em",
    3: "1.45em",
  },
  /* Breakpoints */
  breakpoints: {
    xs: 320,
    sm: 640,
    md: 1024,
    lg: 1400,
    xl: 1600,
  },
  zindex: {
    popover: 300,
    modal: 1000,
  },
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
};

export default variables;
