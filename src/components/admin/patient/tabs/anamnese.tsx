import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import PatientAnamneseDetails from "../components/anamnese-details";
import { useRecoilValue } from "recoil";
import PatientData from "@/atoms/patient";

const AnamneseTab = () => {
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);
  const patientData = useRecoilValue(PatientData);

  useEffect(() => {
    if (patientData === null) return;
    if (Object?.keys?.(patientData?.attributes?.anamnese!).length !== 0) {
      const keys = Object.keys(patientData?.attributes?.anamnese);
      const values = Object.values(patientData?.attributes?.anamnese);
      setAnamneseKeys(keys);
      setAnamneseValues(values);
      return;
    }
  }, [patientData]);

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
