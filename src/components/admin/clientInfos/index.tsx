/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { ClientType } from "types";
import { useRecoilValue } from "recoil";
import { Box, styled, Typography } from "@mui/material";
import { cpfMask, parseDateIso, phoneMask } from "@/services/services";
import UserData from "@/atoms/userData";
import ClientInformationsAdmin from "./informations";
import ClientInformationsProfessional from "./informationsProfessional";
import styles from "../../../styles/ClientDetails.module.css";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";

interface ClientInfoProps {
  client?: ClientType;
}

const professionalTabs = ["Anamnese", "Problemas", "Exames", "Agendamentos"];
const tabs = [
  "Anamnese",
  "Financeiro",
  "Tratamentos",
  "Exames",
  "Agendamentos",
  "Problemas",
  "Anexos",
];

const imageStyle = { width: "100%", height: "100%", borderRadius: "8px" };
const tabStyle = { textTransform: "capitalize", padding: "0 8px" };
const tabActive = {
  backgroundColor: "#1b083e",
  color: "white",
  ...tabStyle,
};
const tabInactive = {
  backgroundColor: "#f5f5f5",
  color: "#1b083e",
  ...tabStyle,
};

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
      <ClientContainer>
        <p>
          Nome: <span>{client?.name}</span>
        </p>

        <p>
          Email: <span>{client?.email}</span>
        </p>

        <p>
          Endereço: <span>{client?.address?.address ?? "Sem endereço"}</span>
        </p>

        <Double>
          <p>
            Nascimento:{" "}
            <span>{parseDateIso(client?.dateBorn) ?? "Não-Cadastrado"}</span>
          </p>
          <p>
            Telefone: <span>{phoneMask(client?.phone ?? "")}</span>
          </p>
        </Double>

        {userData?.role === "admin" && (
          <Double>
            <p>
              CPF: <span>{cpfMask(client?.cpf)}</span>
            </p>
            <p>
              RG:{" "}
              <span>
                {client?.rg === "" ? "Sem RG Cadastrado" : client?.rg}
              </span>
            </p>
          </Double>
        )}
      </ClientContainer>

      <TabsContainer>
        {currTabs.map((item, index) => {
          const style = tabIndex === index ? tabActive : tabInactive;
          return (
            <StyledButton
              key={index}
              sx={style}
              onClick={() => setTabIndex(index)}
            >
              {item}
            </StyledButton>
          );
        })}
      </TabsContainer>

      {userData?.role === "professional" ? (
        <ClientInformationsProfessional tabIndex={tabIndex} client={client} />
      ) : (
        <ClientInformationsAdmin tabIndex={tabIndex} client={client} />
      )}
    </div>
  );
};

const ClientContainer = styled(Box)`
  border: 1.5px solid var(--dark-blue);
  width: 100%;
  padding: 8px 16px;
  margin: 12px 0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  p {
    font-weight: 600;
    font-size: 14px;
    color: var(--dark-blue);
  }
  span {
    font-weight: 400;
    font-size: 14px;
    color: var(--dark-blue);
  }
`;

const Double = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TabsContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  column-gap: 6px;
  flex-wrap: wrap;
  row-gap: 6px;
`;

export default ClientInfos;
