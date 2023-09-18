/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { ClientType } from "types";
import { useRecoilValue } from "recoil";
import { Box, styled, Autocomplete } from "@mui/material";
import { cpfMask, phoneMask } from "@/services/services";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import { StyledTextField } from "@/components/patient/profile";
import ClientInformationsProfessional from "./informationsProfessional";
import styles from "../../../styles/ClientDetails.module.css";
import ClientInformationsAdmin from "./informations";
import EditIcon from "@mui/icons-material/Edit";
import UserData from "@/atoms/userData";
import Loading from "@/components/loading";
import { updateUserData } from "@/services/requests/firestore";
import { Timestamp } from "firebase/firestore";

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
  role: string;
}

const defaultClientData: ClientAttributes = {
  name: "",
  email: "",
  dateBorn: "",
  phone: "",
  cpf: "",
  rg: "",
  role: "",
};

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

const rolesOptions = [
  { name: "Paciente", value: "patient" },
  { name: "Não-Paciente", value: "pre-register" },
  { name: "Selecionado", value: "selected" },
];

const inputColor = {
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "var(--dark-blue)",
  },
};

const ClientInfos = (props: ClientInfoProps) => {
  const { client } = props;
  const [clientData, setClientData] = useState(defaultClientData);
  const [hasEditMode, setHasEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [tabIndex, setTabIndex] = useState(0);
  const userData = useRecoilValue(UserData);
  const currTabs = userData?.role !== "professional" ? tabs : professionalTabs;

  const handleEdit = () => setHasEditMode(!hasEditMode);
  const handleChange = (val, field) =>
    setClientData((prev) => ({ ...prev, [field]: val }));
  const getPatientRole = () => {
    if (clientData?.role === "patient") return "Paciente";
    else if (clientData?.role === "pre-register") return "Não-Paciente";
    else if (clientData?.role === "selected") return "Selecionado";
    else return "";
  };

  const handleSubmit = async () => {
    const { email, dateBorn, phone, rg } = clientData;
    if (email === "" || dateBorn === "" || phone === "" || rg === "")
      return alert("Preencha os campos");

    setIsLoading(true);
    await updateUserData(client?.id, {
      email,
      dateBorn,
      phone,
      rg,
      role: clientData?.role,
      updatedBy: {
        timestamp: Timestamp.now(),
        reporterId: userData?.id,
        reporterName: userData?.name,
      },
    }).then(
      (val) => {
        if (val === "Sucesso") setIsLoading(false);
        setHasEditMode(!hasEditMode);
      },
      (err) => {
        setIsLoading(false);
        return alert("Erro na operação");
      }
    );
  };

  useEffect(() => {
    if (!client || client === undefined) return;

    setClientData((prev) => ({
      name: client?.name,
      email: client?.email,
      dateBorn: client?.dateBorn,
      phone: client?.phone,
      cpf: client?.cpf,
      rg: client?.rg,
      role: client?.role,
    }));
  }, [client]);

  return (
    <div className={styles.container}>
      {isLoading && (
        <Box position="fixed" top={0} left={0} zIndex={9999}>
          <Loading message="Atualizando..." />
        </Box>
      )}

      <div className={styles.picture}>
        <Avatar src={client?.profileImage} alt="" style={imageStyle} />
      </div>

      <h5>Informações do Cliente</h5>
      <ClientContainer>
        <Double>
          <StyledTextField
            value={clientData?.name}
            disabled
            label="Nome"
            margin="dense"
            variant="standard"
            placeholder="Nome do Paciente"
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%", ...inputColor }}
          />
          <StyledTextField
            label="Email"
            margin="dense"
            value={clientData?.email}
            disabled={!hasEditMode}
            placeholder="Email do Paciente"
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%", ...inputColor }}
            onChange={(e) => handleChange(e, "email")}
            variant={!hasEditMode ? "standard" : "outlined"}
          />
        </Double>

        <Double>
          <StyledTextField
            type={"date"}
            margin="dense"
            label="Nascimento"
            disabled={!hasEditMode}
            value={clientData?.dateBorn}
            sx={{ width: "100%", ...inputColor }}
            placeholder="Data de Nascimento"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange(e, "dateBorn")}
            variant={!hasEditMode ? "standard" : "outlined"}
          />
          <StyledTextField
            margin="dense"
            label="Telefone"
            disabled={!hasEditMode}
            value={phoneMask(clientData?.phone ?? "")}
            sx={{ width: "100%", ...inputColor }}
            placeholder="Telefone do Paciente"
            variant={!hasEditMode ? "standard" : "outlined"}
          />
        </Double>

        {userData?.role === "admin" && (
          <Double>
            <StyledTextField
              disabled
              label="CPF"
              margin="dense"
              variant="standard"
              placeholder="CPF do Paciente"
              value={cpfMask(clientData?.cpf)}
              sx={{ width: "100%", ...inputColor }}
            />
            <StyledTextField
              label="RG"
              disabled={!hasEditMode}
              placeholder="RG do Paciente"
              InputLabelProps={{ shrink: true }}
              sx={{ width: "100%", ...inputColor }}
              value={clientData?.rg === "" ? "Sem RG" : clientData?.rg}
              variant={!hasEditMode ? "standard" : "outlined"}
              margin="dense"
            />
          </Double>
        )}

        <Double>
          <StyledTextField
            disabled
            label="Endereço"
            value={client?.address?.address}
            sx={{ width: "70%", ...inputColor }}
            placeholder="Endereço do Paciente"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            variant="standard"
          />
          <Autocomplete
            limitTags={2}
            options={rolesOptions}
            disabled={!hasEditMode}
            sx={{ width: "30%", ...inputColor }}
            value={{ name: getPatientRole(), value: clientData?.role }}
            onChange={(e, v) => handleChange(v.value, "role")}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <StyledTextField
                {...params}
                margin="dense"
                disabled={!hasEditMode}
                sx={!hasEditMode && { mt: "22px" }}
                placeholder="Alterar Tipo de Cliente"
                variant={!hasEditMode ? "standard" : "outlined"}
              />
            )}
          />
        </Double>

        <Box
          columnGap={1}
          display="flex"
          justifyContent="flex-end"
          title="Editar informações do paciente"
        >
          <StyledButton
            endIcon={<EditIcon sx={{ color: "white" }} />}
            onClick={!hasEditMode ? handleEdit : handleSubmit}
          >
            {!hasEditMode ? "Editar" : "Salvar"}
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
