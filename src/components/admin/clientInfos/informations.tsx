import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { ClientType } from "types";
import Receipt from "./receipt";
import ClientExams from "./exams";
import SchedulesPatient from "./schedules";
import ClientInfosTreatments from "./treatments";
import styles from "../../../styles/ClientDetails.module.css";
import ClientDocuments from "./docs";
import ClientProblems from "./problems";
import ClientAnamneseInfos from "./anamnese";

interface ClientInformationsProps {
  tabIndex: number;
  client?: ClientType;
}

const ClientInformationsAdmin = (props: ClientInformationsProps) => {
  const { tabIndex, client } = props;
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);
  const hasAnamnese = tabIndex === 0 && anamneseKeys !== null;
  const hasClient = client === undefined || client === null;

  useEffect(() => {
    if (Object.keys(client!).length !== 0) {
      const keys = Object.keys(client?.anamnese);
      const values = Object.values(client?.anamnese);
      setAnamneseKeys(keys);
      setAnamneseValues(values);
      return;
    }
  }, [client]);

  if (hasClient) return <Typography my={2}>Não há cliente</Typography>;
  if (hasAnamnese)
    return (
      <ClientAnamneseInfos
        anamneseValues={anamneseValues}
        anamneseKeys={anamneseKeys}
        client={client}
      />
    );

  if (tabIndex === 1) return <Receipt client={client} />;
  if (tabIndex === 2) return <ClientInfosTreatments client={client} />;
  if (tabIndex === 3) return <ClientExams client={client} />;
  if (tabIndex === 4) return <SchedulesPatient client={client} />;
  if (tabIndex === 5) return <ClientProblems client={client} />;
  if (tabIndex === 6) return <ClientDocuments client={client} />;
  return (
    <Box p={2}>
      <Typography variant="semibold">Função ainda não desenvolvida.</Typography>
    </Box>
  );
};

export default ClientInformationsAdmin;
