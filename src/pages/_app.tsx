import * as React from "react";
import Head from "next/head";
import theme from "../services/theme";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "../services/createEmotionCache";
import { ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { CacheProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import "@/styles/globals.css";
import "dayjs/locale/pt-br";

const clientSideEmotionCache = createEmotionCache();
const responsiveTheme = responsiveFontSizes(theme);

export default function App(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <RecoilRoot>
          <ThemeProvider theme={responsiveTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </RecoilRoot>
      </CacheProvider>
    </LocalizationProvider>
  );
}
