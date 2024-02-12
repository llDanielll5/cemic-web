import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import PatientAddress from "../components/address";
import PatientData from "@/atoms/patient";
import {
  Autocomplete,
  Box,
  Card,
  Divider,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { cpfMask, phoneMask } from "@/services/services";

interface PatientInformationsInterface {
  clientAddress: any;
  setClientAddress: any;
  handleEditAddress: any;
  handleChangeAddress: any;
  clientData: any;
  handleChange: any;
}

const rolesOptions = [
  { name: "Paciente", value: "PATIENT" },
  { name: "Não-Paciente", value: "PRE-REGISTER" },
  { name: "Selecionado", value: "SELECTED" },
];

const PatientInformations = (props: PatientInformationsInterface) => {
  const {
    clientAddress,
    handleChangeAddress,
    handleEditAddress,
    setClientAddress,
    clientData,
    handleChange,
  } = props;

  const adminData: any = useRecoilValue(UserData);
  const patientData: any = useRecoilValue(PatientData);
  let client = patientData?.attributes;

  const getPatientRole = () => {
    if (clientData?.role === "PATIENT") return "Paciente";
    else if (clientData?.role === "PRE-REGISTER") return "Não-Paciente";
    else if (clientData?.role === "SELECTED") return "Selecionado";
    else return "";
  };

  return (
    <ClientContainer elevation={10}>
      <Stack alignItems="center">
        <Typography variant="h6">Dados Gerais</Typography>
      </Stack>
      <Divider variant="middle" />

      <TextField
        value={clientData?.name}
        label="Nome Completo"
        margin="dense"
        placeholder="Nome do Paciente"
        InputLabelProps={{ shrink: true }}
        onChange={(e) => handleChange(e.target.value, "name")}
        fullWidth
      />
      <TextField
        label="Email"
        margin="dense"
        value={clientData?.email}
        placeholder="Email do Paciente"
        InputLabelProps={{ shrink: true }}
        fullWidth
        onChange={(e) => handleChange(e.target.value, "email")}
      />
      {adminData?.userType === "ADMIN" && (
        <Double>
          <TextField
            label="CPF"
            margin="dense"
            placeholder="CPF do Paciente"
            value={cpfMask(clientData?.cpf)}
            fullWidth
          />
          <TextField
            label="RG"
            placeholder="RG do Paciente"
            InputLabelProps={{ shrink: true }}
            fullWidth
            onChange={({ target }) => handleChange(target.value, "rg")}
            value={clientData?.rg === "" ? "" : clientData?.rg}
            margin="dense"
          />
        </Double>
      )}

      <Double>
        <TextField
          label="Endereço"
          value={clientData?.address}
          fullWidth
          placeholder="Endereço do Paciente"
          onChange={({ target }) => handleChange(target.value, "address")}
          InputLabelProps={{ shrink: true }}
          margin="dense"
        />
        <Autocomplete
          limitTags={2}
          options={rolesOptions}
          fullWidth
          value={{ name: getPatientRole(), value: clientData?.role }}
          onChange={(e, v) => handleChange(v!.value, "role")}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={"Tipo de Paciente"}
              margin="dense"
              placeholder="Alterar Tipo de Cliente"
            />
          )}
        />
      </Double>

      <Double>
        <TextField
          type={"date"}
          margin="dense"
          label="Nascimento"
          value={clientData?.dateBorn}
          fullWidth
          placeholder="Data de Nascimento"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleChange(e.target.value, "dateBorn")}
        />
        <TextField
          margin="dense"
          label="Telefone"
          value={phoneMask(clientData?.phone ?? "")}
          fullWidth
          placeholder="Telefone do Paciente"
          onChange={(e) => handleChange(e.target.value, "phone")}
        />
      </Double>
      <PatientAddress
        clientAddress={clientAddress}
        setClientAddress={setClientAddress}
        handleEditAddress={handleEditAddress}
        handleChangeAddress={handleChangeAddress}
      />
    </ClientContainer>
  );
};

const ClientContainer = styled(Card)`
  width: 100%;
  padding: 1rem 2rem;
  margin: 12px 0;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
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
  column-gap: 16px;
`;

export default PatientInformations;
