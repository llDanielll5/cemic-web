import * as React from "react";
import Head from "next/head";
import { createTheme } from "../services/theme";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "../services/createEmotionCache";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useNProgress } from "@/hooks/useNProgress";
import { CacheProvider } from "@emotion/react";
import { RecoilRoot } from "recoil";
import "@/styles/globals.css";

const clientSideEmotionCache = createEmotionCache();
const SplashScreen = () => null;

export default function App(props: any) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page: any) => page);

  const theme = createTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </RecoilRoot>
      </CacheProvider>
    </LocalizationProvider>
  );
}
