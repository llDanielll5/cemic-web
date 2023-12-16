import React, { useState, useEffect } from "react";
import styles from "../../../styles/ClientDetails.module.css";
import { ClientType } from "types";
import SchedulesPatient from "./schedules";

interface ClientInformationsProps {
  tabIndex: number;
  client?: ClientType;
}

const ClientInformationsProfessional = (props: ClientInformationsProps) => {
  const { tabIndex, client } = props;
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);

  useEffect(() => {
    if (Object?.keys(client!).length !== 0) {
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
        <h3>Problemas</h3>
      </div>
    );
  }
  if (tabIndex === 3) {
    return <SchedulesPatient client={client} />;
  }
  return <h2>teste</h2>;
};

export default ClientInformationsProfessional;
