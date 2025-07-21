import React from "react";
import { Box, Typography } from "@mui/material";
import PatientAnamneseDentistDetails from "./anamnese-details";

const AnamneseTab = ({
  patient,
}: {
  patient: StrapiData<PatientInterface>;
}) => {
  return (
    <Box width="100%" pt={2}>
      <Typography
        textAlign={"center"}
        variant="h5"
        color={(theme: any) => theme.palette.primary}
      >
        Anamnese
      </Typography>
      <PatientAnamneseDentistDetails patient={patient.attributes} />
    </Box>
  );
};

export default AnamneseTab;
