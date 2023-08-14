import React from "react";
import styles from "../../../styles/ClientDetails.module.css";

interface ClientAnamneseProps {
  client: any;
  anamneseKeys?: any;
  anamneseValues: any;
}

const ClientAnamneseInfos = (props: ClientAnamneseProps) => {
  const { client, anamneseKeys, anamneseValues } = props;

  return (
    <div className={styles["client-infos"]}>
      {anamneseKeys?.map((item: any, index: number) => (
        <p className={styles["p-anamnese"]} key={index}>
          {item} <span>{anamneseValues![index]}</span>
        </p>
      ))}
      <p className={styles["p-anamnese"]}>
        Observações: <span>{client?.observations}</span>
      </p>
    </div>
  );
};

export default ClientAnamneseInfos;
