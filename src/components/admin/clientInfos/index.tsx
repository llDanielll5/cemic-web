/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";
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
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import Modal from "@/components/modal";
import { InputsContainer } from "@/components/userForm";

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
  screeningDate: string;
  professionalScreening: string;
  address: string;
}
interface AddressInterface {
  address: string;
  cep: string;
  city: string;
  complement: string;
  line1: string;
  neighbor: string;
  number: string;
  uf: string;
}

const defaultClientData: ClientAttributes = {
  name: "",
  email: "",
  dateBorn: "",
  phone: "",
  cpf: "",
  rg: "",
  role: "",
  screeningDate: "",
  professionalScreening: "",
  address: "",
};
const defaultAddress: AddressInterface = {
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
    WebkitTextFillColor: "gray",
  },
};

const ClientInfos = (props: ClientInfoProps) => {
  const { client } = props;
  const [clientData, setClientData] = useState(defaultClientData);
  const [clientAddress, setClientAddress] =
    useState<AddressInterface>(defaultAddress);
  const [hasEditMode, setHasEditMode] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const snapProfessionals = useOnSnapshotQuery("professionals");

  const [tabIndex, setTabIndex] = useState(0);
  const userData = useRecoilValue(UserData);
  const currTabs = userData?.role !== "professional" ? tabs : professionalTabs;

  const handleEdit = () => setHasEditMode(!hasEditMode);
  const getAddressValues = () => setAddressModal(!addressModal);
  const handleChange = (val, field) =>
    setClientData((prev) => ({ ...prev, [field]: val }));
  const handleChangeAddress = (val, field) =>
    setClientAddress((prev) => ({ ...prev, [field]: val }));
  const getPatientRole = () => {
    if (clientData?.role === "patient") return "Paciente";
    else if (clientData?.role === "pre-register") return "Não-Paciente";
    else if (clientData?.role === "selected") return "Selecionado";
    else return "";
  };

  const handleSubmit = async () => {
    const { name, email, dateBorn, phone, rg } = clientData;
    if (email === "" || dateBorn === "" || phone === "" || rg === "")
      return alert("Preencha os campos");

    setIsLoading(true);
    setLoadingMessage();
    await updateUserData(client?.id, {
      name,
      email,
      dateBorn,
      phone,
      rg,
      role: clientData?.role,
      screeningDate: clientData?.screeningDate,
      professionalScreening: clientData?.professionalScreening ?? "",
      "address.address": clientData?.address,
      "updatedBy.timestamp": Timestamp.now(),
      "updatedBy.reporterId": userData?.id,
      "updatedBy.reporterName": userData?.name,
      "updatedBy.role": userData?.role,
    }).then(
      (val) => {
        if (val === "Sucesso") setIsLoading(false);
        setHasEditMode(!hasEditMode);
      },
      (err) => {
        setIsLoading(false);
        return alert(err);
      }
    );
  };
  const handleEditAddress = async () => {
    const { address, cep, city, complement, line1, neighbor, number, uf } =
      clientAddress;
    const notLocationCompleted =
      city === undefined ||
      line1 === undefined ||
      neighbor === undefined ||
      uf === undefined ||
      cep?.length! < 8;

    if (notLocationCompleted) return alert("Preencha os campos de endereço!");

    setIsLoading(true);
    setLoadingMessage("Alterando Endereço do Paciente!");
    await updateUserData(client?.id, {
      "address.address": address ?? "",
      "address.cep": cep ?? "",
      "address.city": city ?? "",
      "address.complement": complement ?? "",
      "address.line1": line1 ?? "",
      "address.neighbor": neighbor ?? "",
      "address.number": number ?? "",
      "address.uf": uf ?? "",
      "updatedBy.timestamp": Timestamp.now(),
      "updatedBy.reporterId": userData?.id,
      "updatedBy.reporterName": userData?.name,
      "updatedBy.role": userData?.role,
    }).then(
      (val) => {
        if (val === "Sucesso") setIsLoading(false);
        setAddressModal(!addressModal);
      },
      (err) => {
        setIsLoading(false);
        return alert(err);
      }
    );
  };

  const handleGetCep = async (e: any) => {
    setClientAddress(e.target.value, "cep");
    let val = e.target.value;
    if (val.length === 8) {
      setIsLoading(true);
      setLoadingMessage("Carregando informações de CEP");
      try {
        const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
        const json = await res.json();
        if (json) {
          setClientAddress((prev: any) => ({
            neighbor: json.bairro,
            city: json.localidade,
            complement: json.complemento,
            line1: json.logradouro,
            uf: json.uf,
            cep: val,
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
    if (!client || client === undefined) return;

    setClientData((prev) => ({
      name: client?.name,
      email: client?.email,
      dateBorn: client?.dateBorn,
      phone: client?.phone,
      cpf: client?.cpf,
      rg: client?.rg,
      role: client?.role,
      screeningDate: client?.screeningDate,
      professionalScreening: client?.professionalScreening,
      address: client?.address?.address,
    }));
    setClientAddress((prev) => ({
      address: client?.address?.address,
      cep: client?.address?.cep,
      city: client?.address?.city,
      complement: client?.address?.complement,
      line1: client?.address?.line1,
      neighbor: client?.address?.neighbor,
      number: client?.address?.number,
      uf: client?.address?.uf,
    }));
  }, [client]);

  if (isLoading)
    return (
      <Box position="fixed" top={0} left={0} zIndex={200}>
        <Loading message={loadingMessage} />
      </Box>
    );

  return (
    <div className={styles.container}>
      <Modal
        visible={addressModal}
        closeModal={() => setAddressModal(false)}
        style={{ overlay: { zIndex: 100 } }}
      >
        <Typography variant="bold" fontSize={"1rem"} textAlign={"center"}>
          Alterar Endereço
        </Typography>
        <InputsContainer>
          <StyledTextField
            label="CEP*:"
            value={clientAddress?.cep!}
            onChange={handleGetCep}
            inputProps={{ maxLength: 8 }}
            sx={{ width: "100%" }}
          />
          <StyledTextField
            label="Logradouro:"
            value={clientAddress?.line1!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "100%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "line1")}
          />
        </InputsContainer>

        <InputsContainer>
          <StyledTextField
            label="Bairro:"
            value={clientAddress?.neighbor!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "80%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "neighbor")}
          />

          <StyledTextField
            label="Número:"
            value={clientAddress?.number!}
            sx={{ width: "20%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "number")}
          />
        </InputsContainer>

        <InputsContainer>
          <StyledTextField
            label="Cidade:"
            value={clientAddress?.city!}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChangeAddress(e.target.value, "city")}
            sx={{ width: "80%" }}
          />

          <StyledTextField
            label="UF:"
            value={clientAddress?.uf!}
            InputLabelProps={{ shrink: true }}
            sx={{ width: "20%" }}
            onChange={(e) => handleChangeAddress(e.target.value, "uf")}
          />
        </InputsContainer>

        <StyledTextField
          label="Complemento:"
          value={clientAddress?.complement!}
          InputLabelProps={{ shrink: true }}
          sx={{ width: "100%", mt: "16px" }}
          onChange={(e) => handleChangeAddress(e.target.value, "complement")}
        />

        <StyledButton onClick={handleEditAddress} sx={{ mt: 2 }}>
          Salvar
        </StyledButton>
      </Modal>

      <div className={styles.picture}>
        <Avatar src={client?.profileImage} alt="" style={imageStyle} />
      </div>

      <h5>Informações do Cliente</h5>
      <ClientContainer>
        <Double>
          <StyledTextField
            value={clientData?.name}
            disabled={!hasEditMode}
            label="Nome"
            margin="dense"
            placeholder="Nome do Paciente"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange(e.target.value, "name")}
            variant={!hasEditMode ? "standard" : "outlined"}
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
            onChange={(e) => handleChange(e.target.value, "email")}
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
            onChange={(e) => handleChange(e.target.value, "dateBorn")}
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

        <Double>
          <StyledTextField
            type={"date"}
            margin="dense"
            label="Data Triagem"
            disabled={!hasEditMode}
            value={clientData?.screeningDate}
            sx={{ width: "100%", ...inputColor }}
            placeholder="Data de Triagem"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleChange(e.target.value, "screeningDate")}
            variant={!hasEditMode ? "standard" : "outlined"}
          />
          <Autocomplete
            limitTags={2}
            sx={{ width: "100%", mt: "3px" }}
            disabled={!hasEditMode}
            options={snapProfessionals?.map((v) => v?.name)}
            value={clientData?.professionalScreening}
            isOptionEqualToValue={(option, value) => option === value}
            onChange={(e, v) => {
              if (!v) return;
              return handleChange(v, "professionalScreening");
            }}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                label="Profissional da Triagem"
                InputLabelProps={{ shrink: true }}
                placeholder={"Selecione o Profissional."}
                variant={!hasEditMode ? "standard" : "outlined"}
              />
            )}
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
              onChange={({ target }) => handleChange(target.value, "rg")}
              value={clientData?.rg === "" ? "Sem RG" : clientData?.rg}
              variant={!hasEditMode ? "standard" : "outlined"}
              margin="dense"
            />
          </Double>
        )}

        <Double>
          <StyledTextField
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
          justifyContent={!client?.updatedBy ? "flex-end" : "space-between"}
          alignItems="center"
        >
          {!!client?.updatedBy && (
            <Typography variant="small">
              Atualizado por {client?.updatedBy?.reporterName} dia{" "}
              {client?.updatedBy?.timestamp?.toDate()?.toLocaleString()}
            </Typography>
          )}
          <Box display="flex" alignItems="center" flexDirection="column">
            <StyledButton
              title="Editar Endereço do Paciente"
              endIcon={<EditIcon sx={{ color: "white" }} />}
              onClick={getAddressValues}
            >
              Endereço
            </StyledButton>
            <StyledButton
              title="Editar informações do paciente"
              endIcon={<EditIcon sx={{ color: "white" }} />}
              onClick={!hasEditMode ? handleEdit : handleSubmit}
            >
              {!hasEditMode ? "Editar" : "Salvar"}
            </StyledButton>
          </Box>
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
