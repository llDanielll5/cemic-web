/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import { ClientType } from "types";
import { useRecoilValue } from "recoil";
import { Box, styled, Typography } from "@mui/material";
import { cpfMask, parseDateIso, phoneMask } from "@/services/services";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { StyledTextField } from "@/components/patient/profile";
import ClientInformationsProfessional from "./informationsProfessional";
import styles from "../../../styles/ClientDetails.module.css";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import ClientInformationsAdmin from "./informations";
import EditIcon from "@mui/icons-material/Edit";
import UserData from "@/atoms/userData";

interface ClientInfoProps {
  client?: ClientType;
}

interface ClientAttributes {
  name: string;
  email: string;
  dateBorn: string;
  phone: string;
  cpf: string;
  rg: string;
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
  const [clientData, setClientData] = useState();
  const [hasEditMode, setHasEditMode] = useState(false);
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
        <Double>
          <StyledTextField
            value={client?.name}
            sx={{ width: "100%" }}
            disabled
            label="Nome"
            placeholder="Nome do Paciente"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            variant="standard"
          />
          <StyledTextField
            value={client?.email}
            sx={{ width: "100%" }}
            disabled={!hasEditMode}
            label="Email"
            placeholder="Email do Paciente"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            variant="standard"
          />
        </Double>

        <Double>
          <StyledTextField
            value={parseDateIso(client?.dateBorn) ?? "Não-Cadastrado"}
            sx={{ width: "100%" }}
            disabled={!hasEditMode}
            label="Nascimento"
            placeholder="Data de Nascimento"
            margin="dense"
            variant="standard"
          />
          <StyledTextField
            value={phoneMask(client?.phone ?? "")}
            sx={{ width: "100%" }}
            disabled={!hasEditMode}
            label="Telefone"
            placeholder="Telefone do Paciente"
            margin="dense"
            variant="standard"
          />
        </Double>

        {userData?.role === "admin" && (
          <Double>
            <StyledTextField
              value={cpfMask(client?.cpf)}
              sx={{ width: "100%" }}
              disabled={!hasEditMode}
              label="CPF"
              placeholder="CPF do Paciente"
              margin="dense"
              variant="standard"
            />
            <StyledTextField
              value={client?.rg === "" ? "Sem RG Cadastrado" : client?.rg}
              sx={{ width: "100%" }}
              disabled={!hasEditMode}
              label="RG"
              placeholder="RG do Paciente"
              InputLabelProps={{ shrink: true }}
              margin="dense"
              variant="standard"
            />
          </Double>
        )}

        <Double>
          <StyledTextField
            value={client?.address?.address}
            sx={{ width: "90%" }}
            disabled
            label="Endereço"
            placeholder="Endereço do Paciente"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            variant="standard"
          />
          <StyledButton
            sx={{ height: "55px" }}
            title="Alterar endereço do paciente"
          >
            <AddLocationAltIcon />
          </StyledButton>
        </Double>

        <Box
          display="flex"
          justifyContent="flex-end"
          columnGap={1}
          title="Editar informações do paciente"
        >
          <StyledButton endIcon={<EditIcon sx={{ color: "white" }} />}>
            Editar
          </StyledButton>
        </Box>
      </ClientContainer>

      <TabsContainer>
        {currTabs.map((item, index) => {
          const style = tabIndex === index ? tabActive : tabInactive;
          return (
            <StyledButton
              key={index}
              sx={style}
              onClick={() => setTabIndex(index)}
              title={`Aba ${item}`}
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
  column-gap: 12px;
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
