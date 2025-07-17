import { LoadingProvider } from "@/contexts/LoadingContext";
import { createTheme } from "@/services/theme";
import { ThemeProvider } from "@mui/material/styles";
import { RecoilRoot } from "recoil";

export default function DataRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <LoadingProvider>{children}</LoadingProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}
