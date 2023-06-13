/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { ClientType } from "types";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import ClientInformationsAdmin from "./informations";
import styles from "../../../styles/ClientDetails.module.css";
import ClientInformationsProfessional from "./informationsProfessional";
import { cpfMask, parseDateIso, phoneMask } from "@/services/services";

interface ClientInfoProps {
  client?: ClientType;
}

const tabs = [
  "Anamnese",
  "Financeiro",
  "Tratamentos",
  "Protocolos",
  "Problemas",
  "Exames",
  "Agendamentos",
];

const professionalTabs = ["Anamnese", "Problemas", "Exames", "Agendamentos"];
const imageStyle = { width: "100%", height: "100%", borderRadius: "8px" };

const ClientInfos = (props: ClientInfoProps) => {
  const { client } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const userData = useRecoilValue(UserData);

  const currTabs = userData?.role !== "professional" ? tabs : professionalTabs;
  return (
    <div className={styles.container}>
      <div className={styles.picture}>
        <Avatar src={client?.profileImage} alt="" style={imageStyle} />
      </div>

      <h5>Informações do Cliente</h5>
      <div className={styles["client-infos"]}>
        <p>
          Nome: <span>{client?.name}</span>
        </p>

        <p>
          Email: <span>{client?.email}</span>
        </p>

        <p>
          Endereço: <span>{client?.address?.address ?? "Sem endereço"}</span>
        </p>

        <div className={styles.double}>
          <p>
            Nascimento:{" "}
            <span>{parseDateIso(client?.dateBorn) ?? "Não-Cadastrado"}</span>
          </p>
          <p>
            Telefone: <span>{phoneMask(client?.phone ?? "")}</span>
          </p>
        </div>

        {userData?.role === "admin" && (
          <div className={styles.double}>
            <p>
              CPF: <span>{cpfMask(client?.cpf)}</span>
            </p>
            <p>
              RG:{" "}
              <span>
                {client?.rg === "" ? "Sem RG Cadastrado" : client?.rg}
              </span>
            </p>
          </div>
        )}
      </div>

      <div className={styles["tab-container"]}>
        {currTabs.map((item, index) => {
          const style =
            tabIndex === index
              ? { backgroundColor: "#1b083e", color: "white" }
              : undefined;
          return (
            <span key={index} style={style} onClick={() => setTabIndex(index)}>
              {item}
            </span>
          );
        })}
      </div>

      {userData?.role === "admin" ? (
        <ClientInformationsAdmin tabIndex={tabIndex} client={client} />
      ) : (
        <ClientInformationsProfessional tabIndex={tabIndex} client={client} />
      )}
    </div>
  );
};

export default ClientInfos;
