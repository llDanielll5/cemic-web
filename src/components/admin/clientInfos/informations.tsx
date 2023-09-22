import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { ClientType } from "types";
import Receipt from "./receipt";
import ClientExams from "./exams";
import SchedulesPatient from "./schedules";
import ClientInfosTreatments from "./treatments";
import ClientDocuments from "./docs";
import ClientProblems from "./problems";
import ClientAnamneseInfos from "./anamnese";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";

interface ClientInformationsProps {
  tabIndex: number;
  client?: ClientType;
}

const ClientInformationsAdmin = (props: ClientInformationsProps) => {
  const { tabIndex, client } = props;
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);
  const hasAnamnese = tabIndex === 0 && anamneseKeys !== null;
  const notHasClient = client === undefined || client === null;
  const refClient = collection(db, "clients");
  const queryClient = query(refClient, where("id", "==", client?.id ?? ""));
  let snapClient = useOnSnapshotQuery("clients", queryClient, [client]);

  useEffect(() => {
    if (snapClient.length === 0) return;
    if (Object.keys(snapClient[0]!).length !== 0) {
      const keys = Object.keys(snapClient?.[0]?.anamnese);
      const values = Object.values(snapClient?.[0]?.anamnese);
      setAnamneseKeys(keys);
      setAnamneseValues(values);
      return;
    }
  }, [snapClient]);

  if (notHasClient) return <Typography my={2}>Não há cliente</Typography>;
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
