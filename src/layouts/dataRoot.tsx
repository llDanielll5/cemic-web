import { RecoilRoot } from "recoil";
import { createTheme } from "@/services/theme";
import { ThemeProvider } from "@mui/material/styles";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { KeyPressProvider } from "@/contexts/KeyPressContext";

export default function DataRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <LoadingProvider>
          <KeyPressProvider>{children}</KeyPressProvider>
        </LoadingProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
}
