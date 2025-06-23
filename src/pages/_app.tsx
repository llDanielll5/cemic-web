import * as React from "react";
import Head from "next/head";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "../services/createEmotionCache";
import { BaseContext, NextPageContext } from "next/dist/shared/lib/utils";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider } from "@mui/material/styles";
import { useNProgress } from "@/hooks/useNProgress";
import { createTheme } from "../services/theme";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { AppProps } from "next/app";
import "@/styles/globals.css";

const clientSideEmotionCache = createEmotionCache();

export type CustomNextComponentType<
  Context extends BaseContext = NextPageContext,
  InitialProps = {},
  Props = {}
> = React.ComponentType<Props> & {
  getInitialProps?(context: Context): InitialProps | Promise<InitialProps>;
  getLayout: (c: React.ReactElement) => React.ReactElement;
};

interface CustomAppProps extends Omit<AppProps, "Component"> {
  emotionCache: EmotionCache;
  Component: CustomNextComponentType<NextPageContext, any, any>;
}

export default function App(props: CustomAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useNProgress();
  const theme = createTheme();
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => page);

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
            <ToastContainer />
          </ThemeProvider>
        </RecoilRoot>
      </CacheProvider>
    </LocalizationProvider>
  );
}
