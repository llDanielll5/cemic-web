/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from "react";
import { AddressType, AdminType } from "types";
import { useRecoilValue } from "recoil";
import { InputsContainer } from "@/components/userForm";
import { cpfMask, phoneMask } from "@/services/services";
import ClientInformationsProfessional from "./informationsProfessional";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import styles from "../../../styles/ClientDetails.module.css";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SaveIcon from "@mui/icons-material/Save";
import ClientInformationsAdmin from "./informations";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "@/components/loading";
import Modal from "@/components/modal";
import IconButton from "@/components/iconButton";
import { handleUpdatePatient } from "@/axios/admin/patients";
import {
  Avatar,
  TextField,
  Typography,
  Box,
  styled,
  Autocomplete,
  Button,
} from "@mui/material";

interface ClientInfoProps {
  client?: any;
  onUpdate: any;
  adminData: any;
}

interface PatientAttributes {
  name: string;
  email: string;
  dateBorn: string;
  phone: string;
  cpf: string;
  rg: string;
  role: string;
  address: string;
}

const defaultClientData: PatientAttributes = {
  name: "",
  email: "",
  dateBorn: "",
  phone: "",
  cpf: "",
  rg: "",
  role: "",
  address: "",
};
const defaultAddress: AddressType = {
  address: "",
  cep: "",
  city: "",
  complement: "",
  line1: "",
  neighbor: "",
  number: "",
  uf: "",
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

const rolesOptions = [
  { name: "Paciente", value: "PATIENT" },
  { name: "Não-Paciente", value: "PRE-REGISTER" },
  { name: "Selecionado", value: "SELECTED" },
];

const inputColor = {
  backgroundColor: "white",
  padding: ".3rem",
  borderRadius: "1rem",
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "gray",
  },
};

const ClientInfos = (props: ClientInfoProps) => {
  const { client, onUpdate, adminData }: any = props;
  const [clientData, setClientData] = useState(defaultClientData);
  const [clientAddress, setClientAddress] =
    useState<AddressType>(defaultAddress);
  const [hasEditMode, setHasEditMode] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const currTabs = adminData?.userType !== "DENTIST" ? tabs : professionalTabs;

  const handleEdit = () => setHasEditMode(!hasEditMode);
  const getAddressValues = () => setAddressModal(!addressModal);
  const handleChange = (val: any, field: any) =>
    setClientData((prev) => ({ ...prev, [field]: val }));
  const handleChangeAddress = (val: any, field: any) =>
    setClientAddress((prev) => ({ ...prev, [field]: val }));
  const getPatientRole = () => {
    if (clientData?.role === "PATIENT") return "Paciente";
    else if (clientData?.role === "PRE-REGISTER") return "Não-Paciente";
    else if (clientData?.role === "SELECTED") return "Selecionado";
    else return "";
  };

  const adminUpdate = {
    adminInfos: { updated: adminData?.id, updateTimestamp: new Date() },
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
  const handleEditAddress = async () => {
    const { cep, city, line1, neighbor, uf } = clientAddress;
    const notLocationCompleted =
      city === undefined ||
      line1 === undefined ||
      neighbor === undefined ||
      uf === undefined ||
      cep?.length! < 8;

    if (notLocationCompleted) return alert("Preencha os campos de endereço!");

    let data = { data: { address: clientAddress, ...adminUpdate } };

    setLoadingMessage("Alterando Endereço do Paciente!");
    return await handleUpdatePatient(client?.id, data).then(
      (res) => {
        setIsLoading(false);
        setAddressModal(!addressModal);
        onUpdate();
      },
      (err) => {
        setIsLoading(false);
        console.log(err.response);
      }
    );
  };

  const updateClientStatus = useCallback(() => {
    if (!client || client === undefined) return;
    let attr = client?.attributes;

    setClientData({
      name: attr?.name,
      email: attr?.email,
      dateBorn: attr?.dateBorn,
      phone: attr?.phone,
      cpf: attr?.cpf,
      rg: attr?.rg,
      role: attr?.role,
      address: attr?.address?.address,
    });
    setClientAddress({
      address: attr?.address?.address,
      cep: attr?.address?.cep,
      city: attr?.address?.city,
      complement: attr?.address?.complement,
      line1: attr?.address?.line1,
      neighbor: attr?.address?.neighbor,
      number: attr?.address?.number,
      uf: attr?.address?.uf,
    });
  }, [client]);

  const handleNotSaveChanges = () => {
    setHasEditMode(!hasEditMode);
    updateClientStatus();
  };

  const handleGetCep = async (e: any) => {
    setClientAddress((prev) => ({ ...prev, cep: e.target.value }));
    let val = e.target.value;
    if (val.length === 8) {
      setIsLoading(true);
      setLoadingMessage("Carregando informações de CEP");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
        const json: any = await res.json();
        if (json) {
          setClientAddress((prev: any) => ({
            neighbor: json.bairro,
            city: json.localidade,
            complement: json.complemento,
            line1: json.logradouro,
            uf: json.uf,
            cep: val,
            number: json.number,
            address: `${json.logradouro}, ${json.bairro} ${json.complemento}, ${json.localidade} - ${json.uf}`,
          }));
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    updateClientStatus();
  }, [updateClientStatus]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={200}>
        <Loading message={loadingMessage} />
      </Box>
    );

  return (
    <div className={styles.container}>
      <Modal visible={addressModal} closeModal={() => setAddressModal(false)}>
        <Typography variant="h5" fontSize={"1rem"} textAlign={"center"}>
          Alterar Endereço
        </Typography>
        <InputsContainer>
          <TextField
            label="CEP*:"
            value={clientAddress?.cep!}
            onChange={handleGetCep}
            inputProps={{ maxLength: 8 }}
            sx={{ width: "100%" }}
          />
          <TextField
            label="Logradouro:"
            value={clientAddress?.line1!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "line1")}
          />
        </InputsContainer>

        <InputsContainer>
          <TextField
            label="Bairro:"
            value={clientAddress?.neighbor!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "80%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "neighbor")}
          />

          <TextField
            label="Número:"
            value={clientAddress?.number!}
            sx={{ width: "20%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "number")}
          />
        </InputsContainer>

        <InputsContainer>
          <TextField
            label="Cidade:"
            value={clientAddress?.city!}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChangeAddress(e.target.value, "city")}
            sx={{ width: "80%" }}
          />

          <TextField
            label="UF:"
            value={clientAddress?.uf!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "20%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "uf")}
          />
        </InputsContainer>

        <TextField
          label="Complemento:"
          value={clientAddress?.complement!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "100%", mt: "16px" }}
          onChange={(e) => handleChangeAddress(e.target.value, "complement")}
        />

        <StyledButton
          variant="contained"
          color="primary"
          onClick={handleEditAddress}
          sx={{ mt: 2 }}
        >
          Salvar
        </StyledButton>
      </Modal>

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
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
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
              Atualizado por{" "}
              {client?.adminInfos?.updated?.data?.attributes?.name} dia{" "}
              {client?.adminInfos?.updateTimestamp?.toLocaleString()}
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

      <TabsContainer>
        {currTabs.map((item, index) => {
          const style = tabIndex === index ? "primary" : "inherit";
          return (
            <StyledButton
              key={index}
              color={style}
              variant="contained"
              sx={{ height: "30px" }}
              onClick={() => setTabIndex(index)}
              title={`Aba ${item}`}
            >
              {item}
            </StyledButton>
          );
        })}
      </TabsContainer>

      {adminData?.userType === "DENTIST" ? (
        <ClientInformationsProfessional tabIndex={tabIndex} client={client} />
      ) : adminData?.userType === "ADMIN" ? (
        <ClientInformationsAdmin tabIndex={tabIndex} client={client} />
      ) : null}
    </div>
  );
};

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

const Double = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 12px;
`;

const TabsContainer = styled(Box)`
  display: flex;
  width: 100%;
  column-gap: 0.5rem;
  padding: 1rem;
  flex-wrap: wrap;
  border-radius: 0.3rem;
  row-gap: 6px;
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

const StyledButton = styled(Button)`
  -webkit-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
  box-shadow: 4px 5px 13px -7px rgba(0, 0, 0, 0.75);
`;

export default ClientInfos;
