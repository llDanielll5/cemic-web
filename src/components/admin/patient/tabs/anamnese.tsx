import React from "react";
import { Box, Typography } from "@mui/material";
import PatientAnamneseDetails from "../components/anamnese-details";

const AnamneseTab = () => {
  return (
    <Box width="100%" pt={2}>
      <Typography
        textAlign={"center"}
        variant="h5"
        color={(theme: any) => theme.palette.primary}
      >
        Anamnese
      </Typography>
      <PatientAnamneseDetails />
    </Box>
  );
};

export default AnamneseTab;
