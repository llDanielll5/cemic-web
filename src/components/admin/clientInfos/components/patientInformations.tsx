import React, { useState } from "react";
import IconButton from "@/components/iconButton";
import { handleUpdatePatient } from "@/axios/admin/patients";
import { useRecoilValue } from "recoil";
import { cpfMask, phoneMask } from "@/services/services";
import UserData from "@/atoms/userData";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import {
  Autocomplete,
  Avatar,
  Box,
  TextField,
  Typography,
  styled,
} from "@mui/material";

interface PatientInformationsInterface {
  client?: any;
  clientData?: any;
  updateClientStatus: any;
  setIsLoading: any;
  setLoadingMessage: any;
  onUpdate: any;
  handleChange: any;
  getAddressValues: any;
}

const inputColor = {
  backgroundColor: "white",
  padding: ".3rem",
  borderRadius: "1rem",
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "gray",
  },
};

const rolesOptions = [
  { name: "Paciente", value: "PATIENT" },
  { name: "Não-Paciente", value: "PRE-REGISTER" },
  { name: "Selecionado", value: "SELECTED" },
];

const PatientInformations = (props: PatientInformationsInterface) => {
  const {
    client,
    clientData,
    updateClientStatus,
    setIsLoading,
    setLoadingMessage,
    onUpdate,
    handleChange,
    getAddressValues,
  } = props;

  const [hasEditMode, setHasEditMode] = useState(false);
  const adminData: any = useRecoilValue(UserData);

  const adminUpdate = {
    adminInfos: { updated: adminData?.id, updateTimestamp: new Date() },
  };
  const getPatientRole = () => {
    if (clientData?.role === "PATIENT") return "Paciente";
    else if (clientData?.role === "PRE-REGISTER") return "Não-Paciente";
    else if (clientData?.role === "SELECTED") return "Selecionado";
    else return "";
  };
  const handleEdit = () => setHasEditMode(!hasEditMode);
  const handleNotSaveChanges = () => {
    setHasEditMode(!hasEditMode);
    updateClientStatus();
  };

  const handleSubmit = async () => {
    const { name, email, dateBorn, phone, rg } = clientData;
    if (email === "" || dateBorn === "" || phone === "" || rg === "")
      return alert("Preencha os campos");

    setIsLoading(true);
    setLoadingMessage("Atualizando informações do Paciente");

    let data = {
      data: {
        rg,
        name,
        email,
        phone,
        dateBorn,
        role: clientData?.role,
        address: { address: clientData?.address },
        ...adminUpdate,
      },
    };

    await handleUpdatePatient(client?.id, data).then(
      (res) => {
        setIsLoading(false);
        setHasEditMode(!hasEditMode);
        onUpdate();
      },
      (err) => {
        setIsLoading(false);
        console.log(err.response);
      }
    );
  };

  return (
    <ClientContainer>
      <Double>
        <Avatar
          alt=""
          src={client?.profileImage}
          style={{ width: "4rem", height: "4rem", borderRadius: 10 }}
        />
        <TextField
          value={clientData?.name}
          disabled={!hasEditMode}
          label="Paciente"
          margin="dense"
          placeholder="Nome do Paciente"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleChange(e.target.value, "name")}
          variant={!hasEditMode ? "standard" : "outlined"}
          sx={{ width: "100%", ...inputColor }}
        />
        <TextField
          label="Email"
          margin="dense"
          value={clientData?.email}
          disabled={!hasEditMode}
          placeholder="Email do Paciente"
          InputLabelProps={{ shrink: true }}
          sx={{ width: "100%", ...inputColor }}
          onChange={(e) => handleChange(e.target.value, "email")}
          variant={!hasEditMode ? "standard" : "outlined"}
        />
      </Double>

      <Double>
        <TextField
          type={"date"}
          margin="dense"
          label="Nascimento"
          disabled={!hasEditMode}
          value={clientData?.dateBorn}
          sx={{ width: "100%", ...inputColor }}
          placeholder="Data de Nascimento"
          InputLabelProps={{ shrink: true }}
          onChange={(e) => handleChange(e.target.value, "dateBorn")}
          variant={!hasEditMode ? "standard" : "outlined"}
        />
        <TextField
          margin="dense"
          label="Telefone"
          disabled={!hasEditMode}
          value={phoneMask(clientData?.phone ?? "")}
          sx={{ width: "100%", ...inputColor }}
          placeholder="Telefone do Paciente"
          variant={!hasEditMode ? "standard" : "outlined"}
          onChange={(e) => handleChange(e.target.value, "phone")}
        />
      </Double>

      {adminData?.userType === "ADMIN" && (
        <Double>
          <TextField
            disabled
            label="CPF"
            margin="dense"
            variant="standard"
            placeholder="CPF do Paciente"
            value={cpfMask(clientData?.cpf)}
            sx={{ width: "100%", ...inputColor }}
          />
          <TextField
            label="RG"
            disabled={!hasEditMode}
            placeholder="RG do Paciente"
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%", ...inputColor }}
            onChange={({ target }) => handleChange(target.value, "rg")}
            value={clientData?.rg === "" ? "" : clientData?.rg}
            variant={!hasEditMode ? "standard" : "outlined"}
            margin="dense"
          />
        </Double>
      )}

      <Double>
        <TextField
          disabled={!hasEditMode}
          label="Endereço"
          value={clientData?.address}
          sx={{ width: "70%", ...inputColor }}
          placeholder="Endereço do Paciente"
          onChange={({ target }) => handleChange(target.value, "address")}
          variant={!hasEditMode ? "standard" : "outlined"}
          InputLabelProps={{ shrink: true }}
          margin="dense"
        />
        <Autocomplete
          limitTags={2}
          options={rolesOptions}
          disabled={!hasEditMode}
          sx={{ width: "30%", ...inputColor }}
          value={{ name: getPatientRole(), value: clientData?.role }}
          onChange={(e, v) => handleChange(v!.value, "role")}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              disabled={!hasEditMode}
              sx={!hasEditMode ? { mt: "22px" } : undefined}
              placeholder="Alterar Tipo de Cliente"
              variant={!hasEditMode ? "standard" : "outlined"}
            />
          )}
        />
      </Double>

      <Box
        columnGap={1}
        display="flex"
        justifyContent={
          !client?.adminInfos?.updated ? "flex-end" : "space-between"
        }
        alignItems="center"
      >
        {!!client?.adminInfos && (
          <Typography variant="caption">
            Atualizado por {client?.adminInfos?.updated?.data?.attributes?.name}{" "}
            dia {client?.adminInfos?.updateTimestamp?.toLocaleString()}
          </Typography>
        )}
        <Box display="flex" alignItems="center" columnGap={1}>
          {hasEditMode && (
            <IconEdit
              tooltip="Não Salvar informações"
              onClick={handleNotSaveChanges}
              iconSize="large"
            >
              <CloseIcon color="primary" />
            </IconEdit>
          )}
          <IconButton
            iconSize="large"
            tooltip="Editar informações do paciente"
            onClick={!hasEditMode ? handleEdit : handleSubmit}
          >
            {!hasEditMode ? (
              <EditNoteIcon color="primary" />
            ) : (
              <SaveIcon color="primary" />
            )}
          </IconButton>
          <IconButton
            iconSize="large"
            tooltip="Editar endereço do paciente"
            onClick={getAddressValues}
          >
            <EditLocationAltIcon color="primary" />
          </IconButton>
        </Box>
      </Box>
    </ClientContainer>
  );
};

const Double = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 12px;
`;

const ClientContainer = styled(Box)`
  border: 1.5px solid #f3f3f3;
  background-color: #f3f3f3;
  -webkit-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
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

const IconEdit = styled(IconButton)`
  background-color: var(--dark-blue);
  border-radius: 1rem;
  :hover {
    transition: 0.3s;
    background-color: var(--dark-blue);
    opacity: 0.8;
  }
`;

export default PatientInformations;
