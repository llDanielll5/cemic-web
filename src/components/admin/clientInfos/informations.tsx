import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { ClientType } from "types";
import Receipt from "./receipt";
import ClientExams from "./exams";
import SchedulesPatient from "./schedules";
import ClientInfosTreatments from "./treatments";
import styles from "../../../styles/ClientDetails.module.css";

interface ClientInformationsProps {
  tabIndex: number;
  client?: ClientType;
}

const ClientInformationsAdmin = (props: ClientInformationsProps) => {
  const { tabIndex, client } = props;
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);

  useEffect(() => {
    if (Object.keys(client!).length !== 0) {
      const keys = Object.keys(client?.anamnese);
      const values = Object.values(client?.anamnese);
      setAnamneseKeys(keys);
      setAnamneseValues(values);
      return;
    }
  }, [client]);

  if (client === undefined || client === null)
    return (
      <div>
        <h2>Não há cliente</h2>
      </div>
    );

  if (tabIndex === 0)
    return (
      <div className={styles["client-infos"]}>
        {anamneseKeys?.map((item, index) => (
          <p className={styles["p-anamnese"]} key={index}>
            {item} <span>{anamneseValues![index]}</span>
          </p>
        ))}
        <p className={styles["p-anamnese"]}>
          Observações: <span>{client?.observations}</span>
        </p>
      </div>
    );

  if (tabIndex === 1) {
    return (
      <div className={styles["client-infos"]}>
        <h3>Recibos</h3>
        <Receipt clientId={client?.id} />
      </div>
    );
  }
  if (tabIndex === 2) {
    return <ClientInfosTreatments client={client} />;
  }
  if (tabIndex === 3) {
    return <ClientExams client={client} />;
  }
  if (tabIndex === 4) return <SchedulesPatient client={client} />;
  return (
    <Box p={2}>
      <Typography variant="semibold">Função ainda não desenvolvida.</Typography>
    </Box>
  );
};

export default ClientInformationsAdmin;
