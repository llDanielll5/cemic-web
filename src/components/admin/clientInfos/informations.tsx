import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Receipt from "./receipt";
import ClientExams from "./exams";
import ClientDocuments from "./docs";
import ClientProblems from "./problems";
import SchedulesPatient from "./schedules";
import ClientAnamneseInfos from "./anamnese";
import ClientInfosTreatments from "./treatments";
import { handleGetSinglePatient } from "@/axios/admin/patients";

interface ClientInformationsProps {
  tabIndex: number;
  client?: any;
}

const ClientInformationsAdmin = (props: ClientInformationsProps) => {
  const { tabIndex, client }: any = props;
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  const hasAnamnese = tabIndex === 0 && anamneseKeys !== null;
  const notHasClient = client === undefined || client === null;

  const handleGetPatient = async () => {
    return await handleGetSinglePatient(client!.id).then(
      (res) => setPatientData(res.data.data),
      (err) => console.log(err.response)
    );
  };

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

  useEffect(() => {
    handleGetPatient();
  }, []);

  if (notHasClient) return <Typography my={2}>Não há cliente</Typography>;
  if (hasAnamnese)
    return (
      <ClientAnamneseInfos
        anamneseValues={anamneseValues}
        anamneseKeys={anamneseKeys}
        client={patientData}
        onUpdate={handleGetPatient}
      />
    );
  if (tabIndex === 1) return <Receipt client={patientData} />;
  if (tabIndex === 2) return <ClientInfosTreatments client={patientData} />;
  if (tabIndex === 3) return <ClientExams client={patientData} />;
  if (tabIndex === 4) return <SchedulesPatient client={patientData} />;
  if (tabIndex === 5) return <ClientProblems client={patientData} />;
  if (tabIndex === 6) return <ClientDocuments client={patientData} />;

  return (
    <Box p={2}>
      <Typography variant="subtitle1">
        Função ainda não desenvolvida.
      </Typography>
    </Box>
  );
};

export default ClientInformationsAdmin;
