/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import NextLink from "next/link";
import { Box, Typography, Unstable_Grid2 as Grid } from "@mui/material";

const welcomeStyle = {
  fontSize: "24px",
  lineHeight: "32px",
  mb: 1,
  color: "var(--dark-blue)",
  alignItems: "center",
};
const gradient = {
  alignItems: "center",
  background: "radial-gradient(80% 70% at 50% 50%, white 50%, lightblue 100%)",
  color: "white",
  display: "flex",
  justifyContent: "center",
  "& img": {
    maxWidth: "100%",
  },
};
const headerGrid = {
  backgroundColor: "background.paper",
  display: "flex",
  flexDirection: "column",
  position: "relative",
};
const headerStyle = {
  left: 0,
  p: 3,
  position: "fixed",
  top: 0,
  width: "100%",
};
const logoStyle = {
  display: "inline-flex",
  height: 50,
  width: 50,
};

export const Layout = (props: any) => {
  const { children } = props;

  return (
    <Box component="main" sx={{ display: "flex", flex: "1 1 auto" }}>
      <Grid container sx={{ flex: "1 1 auto" }}>
        <Grid xs={12} lg={6} sx={headerGrid}>
          <Box component="header" sx={headerStyle}>
            <Box component={NextLink} href="/" sx={logoStyle}>
              <img src="/images/logo.png" alt="" />
            </Box>
          </Box>
          {children}
        </Grid>
        <Grid xs={12} lg={6} sx={gradient}>
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={welcomeStyle}
              variant="h1"
            >
              Bem-Vindo a
            </Typography>

            <img
              alt=""
              src="/images/cemicLogo.png"
              style={{ mixBlendMode: "multiply" }}
            />
            <Typography
              align="center"
              sx={{ mb: 3, mt: 2, color: "var(--dark-blue)" }}
              variant="h5"
            >
              O Maior projeto de Reabilitação Oral do BRASIL!
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
