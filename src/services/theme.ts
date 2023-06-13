import { createTheme } from "@mui/material/styles";
import { colors } from "../styles/colors";

declare module "@mui/material/styles" {
  interface Palette {
    primaryLightBlue: Palette["primary"];
    primaryMedium: Palette["primary"];
    complementary: Palette["primary"];
    complementaryLightBlue: Palette["primary"];
    complementaryDarkBlue: Palette["primary"];
    alertRed: Palette["primary"];
    alertOrange: Palette["primary"];
    alertGreen: Palette["primary"];
    basicWhite: Palette["primary"];
    basicGray: Palette["primary"];
    basicLightGray: Palette["primary"];
    basicDarkGray: Palette["primary"];
    basicBlack: Palette["primary"];
    basicPink: Palette["primary"];
  }
  interface PaletteOptions {
    primaryLightBlue: PaletteOptions["primary"];
    primaryMedium: PaletteOptions["primary"];
    complementary: PaletteOptions["primary"];
    complementaryLightBlue: PaletteOptions["primary"];
    complementaryDarkBlue: PaletteOptions["primary"];
    alertRed: PaletteOptions["primary"];
    alertOrange: PaletteOptions["primary"];
    alertGreen: PaletteOptions["primary"];
    basicWhite: PaletteOptions["primary"];
    basicGray: PaletteOptions["primary"];
    basicLightGray: PaletteOptions["primary"];
    basicDarkGray: PaletteOptions["primary"];
    basicBlack: PaletteOptions["primary"];
    basicPink: PaletteOptions["primary"];
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    bold: React.CSSProperties;
    semibold: React.CSSProperties;
    normal: React.CSSProperties;
    small: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    bold?: React.CSSProperties;
    semibold?: React.CSSProperties;
    normal?: React.CSSProperties;
    small?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bold: true;
    semibold: true;
    normal: true;
    small: true;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryDarkBlue,
    },
    primaryLightBlue: {
      main: colors.primaryLightBlue,
    },
    primaryMedium: {
      main: colors.primaryMediumBlue,
    },
    secondary: {
      main: colors.complementaryMediumBlue,
    },
    complementary: {
      main: colors.complementaryMediumBlue,
    },
    complementaryDarkBlue: {
      main: colors.complementaryDarkBlue,
    },
    complementaryLightBlue: {
      main: colors.complementaryLightBlue,
    },
    alertRed: {
      main: colors.alertRed,
    },
    alertOrange: {
      main: colors.alertOrange,
    },
    alertGreen: {
      main: colors.alertGreen,
    },
    basicBlack: {
      main: colors.basicBlack,
    },
    basicDarkGray: {
      main: colors.basicDarkGray,
    },
    basicGray: {
      main: colors.basicMediumGray,
    },
    basicLightGray: {
      main: colors.basicLightGray,
    },
    basicPink: {
      main: colors.basicPink,
    },
    basicWhite: {
      main: colors.basicWhite,
    },
    error: {
      main: colors.alertRed,
    },
  },
  typography: {
    fontFamily: "Poppins",
    bold: {
      color: "#1b083e",
      fontFamily: "Poppins",
      fontWeight: 700,
      fontSize: "1rem",
      lineHeight: "1.225rem",
    },
    semibold: {
      color: "#1b083e",
      fontFamily: "Poppins",
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.225rem",
    },
    normal: {
      color: "#1b083e",
      fontFamily: "Poppins",
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: "1.225rem",
    },
    small: {
      color: "#1b083e",
      fontFamily: "Poppins",
      fontWeight: 400,
      fontSize: ".8rem",
      lineHeight: "1rem",
    },
  },
});

export default theme;
