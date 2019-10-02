const colors = {
  coral200: "#FED5C0",
  coral100: "#FEECDF",
  coral300: "#FCB99F",
  coral400: "#FA9D87",
  coral500: "#F77160",
  coral600: "#D44A46",
  coral700: "#B13036",
  coral800: "#8F1E2D",
  coral900: "#761227",
  blue100: "#D2DCF6",
  blue200: "#A7BAEE",
  blue300: "#7188CD",
  blue400: "#44589C",
  blue500: "#17255A",
  blue600: "#101C4D",
  blue700: "#0B1440",
  blue800: "#070D34",
  blue900: "#04092B",
  grey100: "#F4F7F7",
  grey200: "#EAEFF0",
  grey300: "#CBD1D2",
  grey400: "#14171A",
  grey500: "#65696B",
  grey600: "#49545C",
  grey700: "#32404D",
  grey800: "#202E3E",
  grey900: "#132033",
  green100: "#D8F9D5",
  green200: "#ADF3AD",
  green300: "#7CDB85",
  green400: "#54B767",
  green500: "#268742",
  green600: "#1B743D",
  green700: "#136138",
  green800: "#0C4E32",
  green900: "#07402E",
  red100: "#FCE5D9",
  red200: "#FAC6B4",
  red300: "#F29D8B",
  red400: "#E5766C",
  red500: "#D53F3F",
  red600: "#B72E39",
  red700: "#991F34",
  red800: "#7B142E",
  red900: "#660C2B",
  yellow100: "#FFFADF",
  yellow200: "#FFF4C0",
  yellow300: "#FFECA1",
  yellow400: "#FFE48A",
  yellow500: "#FFD863",
  yellow600: "#DBB248",
  yellow700: "#B78F31",
  yellow800: "#936D1F",
  yellow900: "#7A5513",
  teal100: "#E0FCF2",
  teal200: "#C2F9EA",
  teal300: "#9FECDF",
  teal400: "#81DBD3",
  teal500: "#59C3C3",
  teal600: "#419EA7",
  teal700: "#2C7B8C",
  teal800: "#1C5B71",
  teal900: "#11435D",
  mono900: "#14171A",
  mono500: "#353F44",
  mono100: "#65696B",
  white500: "#EFEFEF",
  pure: {
    white: "#FFFFFF",
    black: "#000000",
  },
};

const variables2 = {
  colors,
  palette: {
    text: {
      light: colors.white500,
      dark: colors.mono900,
      primary: colors.mono500,
      secondary: colors.mono100,
    },
    primary: {
      lightest: colors.teal100,
      main: colors.teal700,
      darkest: colors.teal900,
    },
    grey: {
      main: colors.grey500,
      lightest: colors.grey200,
      lighter: colors.grey300,
      darkest: colors.grey700,
    },
    error: {
      lightest: colors.red100,
      main: colors.red500,
      darkest: colors.red700,
    },
    success: {
      main: colors.green500,
    },
    // New Tokens
    timestamp: colors.mono100,
    label: {
      regular: colors.mono100,
      emphasis: colors.mono500,
    },
    storyTitle: colors.mono500,
    username: {
      regular: colors.mono500,
      emphasis: colors.mono900,
      background: {
        hover: colors.grey200,
      },
    },
    commentText: colors.mono900,
    linkText: colors.teal700,
    marker: {
      reported: colors.red500,
      pending: colors.teal700,
    },
    counterBadge: {
      background: {
        default: colors.grey500,
        emphasis: colors.teal600,
        alert: colors.red500,
      },
      foreground: colors.pure.white,
    },
    button: {
      outline: {
        approve: colors.green500,
        reject: colors.red500,
        labelSecondary: colors.mono100,
      },
    },
    accordionLabel: colors.mono500,
    reasonText: colors.mono500,
    details: {
      header: colors.mono500,
      divider: colors.grey100,
    },
    tab: {
      default: colors.mono100,
      active: colors.teal600,
      divider: colors.grey100,
    },
  },
  fontFamily: {
    primary: "Open Sans",
    secondary: "Nunito",
  },
  lineHeight: {
    bodyComment: 1.45,
    bodyShort: 1.3,
    reset: 1,
    title: 1.15,
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
    iconLarge: "1.5rem",
    iconMedium: "1.125rem",
    iconSmall: "0.875rem",
    iconXSmall: "0.75rem",
  },
  fontWeight: {
    primary: {
      bold: 600,
      semiBold: 600,
      regular: 300,
    },
    secondary: {
      bold: 700,
      regular: 300,
    },
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
  roundCorners: "2px",
};

export default variables2;
