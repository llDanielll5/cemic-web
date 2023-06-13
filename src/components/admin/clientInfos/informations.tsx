import React, { useState, useEffect } from "react";
import styles from "../../../styles/ClientDetails.module.css";
import { CgCloseR, CgCheckR } from "react-icons/cg";
import { ClientType } from "types";
import Receipt from "./receipt";
import ClientInfosTreatments from "./treatments";
import ClientExams from "./exams";
import SchedulesPatient from "./schedules";

interface ClientInformationsProps {
  tabIndex: number;
  client?: ClientType;
}

const ClientInformationsAdmin = (props: ClientInformationsProps) => {
  const { tabIndex, client } = props;
  const [anamneseKeys, setAnamneseKeys] = useState<string[] | null>(null);
  const [anamneseValues, setAnamneseValues] = useState<any[] | null>(null);

  useEffect(() => {
    if (client?.anamneseFilled === true) {
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

  const { address, anamnese } = client;

  const renderTermsIcon = (type: "implant" | "crown") => {
    const check = <CgCheckR className={styles.check} />;
    const close = <CgCloseR className={styles.close} />;
    if (type === "implant") {
      return client?.terms?.implant ? check : close;
    }
    if (type === "crown") {
      return client?.terms?.crown ? check : close;
    }
  };

  if (tabIndex === 0)
    return (
      <div className={styles["client-infos"]}>
        {client?.anamneseFilled ? (
          <>
            {anamneseKeys?.map((item, index) => (
              <p className={styles["p-anamnese"]} key={index}>
                {item} <span>{anamneseValues![index]}</span>
              </p>
            ))}
            <p className={styles["p-anamnese"]}>
              Observações: <span>{client?.observations}</span>
            </p>

            <div className={styles.terms}>
              <h2>Termos aceitos</h2>
              <div className={styles.flex}>
                <div className={styles.content}>
                  <p>Implantes {renderTermsIcon("implant")}</p>
                </div>
                <div className={styles.content}>
                  <p>Coroas {renderTermsIcon("crown")}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h3>Paciente não preencheu a Anamnese</h3>
        )}
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
  if (tabIndex === 5) {
    return <ClientExams client={client} />;
  }
  if (tabIndex === 6) return <SchedulesPatient client={client} />;
  return <h2>Sem informações</h2>;
};

export default ClientInformationsAdmin;
