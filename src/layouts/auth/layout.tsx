/* eslint-disable @next/next/no-img-element */
import PropTypes from "prop-types";
import NextLink from "next/link";
import { Box, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { Logo } from "src/components/new-admin/comps/logo";

// TODO: Change subtitle text

export const Layout = (props: any) => {
  const { children } = props;

  const coloredText = (color: string, letter: string) => (
    <Box component="a" sx={{ color }} target="_blank">
      {letter}
    </Box>
  );

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
      }}
    >
      <Grid container sx={{ flex: "1 1 auto" }}>
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            component="header"
            sx={{
              left: 0,
              p: 3,
              position: "fixed",
              top: 0,
              width: "100%",
            }}
          >
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: "inline-flex",
                height: 32,
                width: 32,
              }}
            >
              <img src="/images/logo.png" alt="" />
            </Box>
          </Box>
          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: "center",
            background:
              "radial-gradient(50% 50% at 50% 50%, white 50%, var(--blue) 100%)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            "& img": {
              maxWidth: "100%",
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                mb: 1,
                color: "var(--dark-blue)",
              }}
              variant="h1"
            >
              Bem-Vindo a{" "}
              <img
                src="/images/cemicText.png"
                alt=""
                style={{ width: "auto", height: 30 }}
              />
            </Typography>

            <img
              alt=""
              src="/images/clients3.jpg"
              style={{ "mix-blend-mode": "multiply" }}
            />
            <Typography
              align="center"
              sx={{ mb: 3, color: "var(--dark-blue)" }}
              variant="subtitle1"
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
