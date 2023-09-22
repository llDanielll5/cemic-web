import React, { useState } from "react";
import { createClient } from "@/services/requests/auth";
import { nameCapitalized } from "@/services/services";
import { Box, styled, IconButton } from "@mui/material";
import { AddressType } from "types";
import UserForm from "@/components/userForm";
import AnamneseForm from "@/components/anamneseForm";
import CancelIcon from "@mui/icons-material/Cancel";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import { Timestamp } from "firebase/firestore";

interface UserDefaultEdit {
  bornDate: string;
  cpf: string;
  name: string;
  rg: string;
  email: string;
  firstLetter: string;
  id: string;
  phone: string;
  profileImage: string;
  role: "patient" | "pre-register" | "selected";
  dateBorn: string;
  sexo: string;
  anamnese: any | null;
  screeningDate: string;
}

interface AnamneseProps {
  setAddressLoading: any;
  setUserUpdating: any;
  onClose: () => void;
}
export type AnswerType = "SIM" | "NÃO" | "NÃO SEI" | "";
export interface AnamneseQuestions {
  [q: string]: AnswerType;
}

const defaultValues: UserDefaultEdit = {
  bornDate: "",
  cpf: "",
  name: "",
  phone: "",
  rg: "",
  anamnese: null,
  dateBorn: "",
  email: "",
  firstLetter: "",
  id: "",
  profileImage: "",
  role: "pre-register",
  sexo: "NENHUM",
  screeningDate: "",
};

const defaultAddress: AddressType = {
  neighbor: "",
  cep: "",
  city: "",
  complement: "",
  line1: "",
  uf: "",
  address: "",
};

export const anamneseQuestions: AnamneseQuestions = {
  "Está tomando alguma medicação no momento?": "",
  "Sofre ou sofreu de algum problema no coração?": "",
  "É diabético?": "",
  "Possui dificuldade de cicatrização?": "",
  "Tem ou teve alguma doença nos rins ou fígado?": "",
  "Sofre de epilepsia?": "",
  "Já esteve hospitalizado por algum motivo?": "",
  "Tem anemia?": "",
  "É alérgico a algum medicamento?": "",
  "Já teve algum problema com anestésicos?": "",
  "Tem ansiedade?": "",
  "Faz uso de AAS?": "",
};

const NewPatientForm = (props: AnamneseProps) => {
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const [userData, setUserData] = useState<UserDefaultEdit>(defaultValues);
  const [locationData, setLocationData] = useState<AddressType>(defaultAddress);
  const [observations, setObservations] = useState("");
  const [implantTermRead, setImplantTermRead] = useState(false);
  const [crownTermRead, setCrownTermRead] = useState(false);
  const [page, setPage] = useState(0);
  const adminData: any = useRecoilValue(UserData);

  const handleMasked = (value: string, type: string, setState: any) => {
    const masked = type === "cpf" ? cpfMask : phoneMask;
    setState((prev: any) => ({ ...prev, [type]: masked(value) }));
  };
  const handleChange = (e: any, value: string, setState: any) => {
    setState((prev: any) => ({ ...prev, [value]: e }));
  };
  const handleAnswer = (value: AnswerType, question: string) => {
    return setAnamneseData((prev) => ({ ...prev, [question]: value }));
  };

  const handleGetCep = async (e: any) => {
    handleChange(e.target.value, "cep", setLocationData);
    let val = e.target.value;
    if (val.length === 8) {
      props.setAddressLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
        const json = await res.json();
        if (json) {
          setLocationData((prev: any) => ({
            neighbor: json.bairro,
            city: json.localidade,
            complement: json.complemento,
            line1: json.logradouro,
            uf: json.uf,
            cep: val,
            address: `${json.logradouro}, ${json.bairro} ${json.complemento}, ${json.localidade} - ${json.uf}`,
          }));
          props.setAddressLoading(false);
        }
      } catch (error) {
        props.setAddressLoading(false);
      }
    }
  };

  const phoneMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };
  const cpfMask = (value: any) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };

  const nextPage = () => setPage((prev) => prev + 1);
  const handleBackPage = () => setPage((prev) => prev - 1);

  const handleNextPage = () => {
    const notUserCompleted =
      userData.bornDate === "" ||
      userData.cpf?.length! < 14 ||
      userData?.name === "" ||
      userData?.phone?.length! < 14 ||
      userData?.rg?.length! < 4;
    const notLocationCompleted =
      locationData?.city === undefined ||
      locationData?.line1 === undefined ||
      locationData?.neighbor === undefined ||
      locationData?.uf === undefined ||
      locationData?.cep?.length! < 8;

    const hasFinishAnamnese =
      anamneseData["Está tomando alguma medicação no momento?"] !== "" &&
      anamneseData["Sofre ou sofreu de algum problema no coração?"] !== "" &&
      anamneseData["É diabético?"] !== "" &&
      anamneseData["Possui dificuldade de cicatrização?"] !== "" &&
      anamneseData["Tem ou teve alguma doença nos rins ou fígado?"] !== "" &&
      anamneseData["Sofre de epilepsia?"] !== "" &&
      anamneseData["Já esteve hospitalizado por algum motivo?"] !== "" &&
      anamneseData["Tem anemia?"] !== "" &&
      anamneseData["É alérgico a algum medicamento?"] !== "" &&
      anamneseData["Já teve algum problema com anestésicos?"] !== "" &&
      anamneseData["Tem ansiedade?"] !== "" &&
      anamneseData["Faz uso de AAS?"] !== "";

    if (page === 0) {
      if (notUserCompleted)
        return alert("Conclua todos os campos de dados pessoais!");
      if (userData?.role === "pre-register") return handleFinish();
      if (notLocationCompleted)
        return alert("Você deve preencher um endereço completo válido!");
      return nextPage();
    }

    if (page === 1) {
      if (!hasFinishAnamnese) return alert("Preencha a Anamnese completa!");
      if (userData?.screeningDate === "")
        return alert("Sem data de triagem selecionada");
      return handleFinish();
    }
  };

  const handleFinish = async () => {
    props.setUserUpdating(true);

    const phoneReplaced = userData
      ?.phone!.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    const cpfReplaced = userData
      ?.cpf!.replace(".", "")
      .replace("-", "")
      .replace(".", "");

    const completeName = nameCapitalized(userData!.name!);

    const clientData = {
      address: {
        neighbor: locationData?.neighbor ?? "",
        address: locationData?.address ?? "",
        city: locationData?.city ?? "",
        line1: locationData?.line1 ?? "",
        uf: locationData?.uf ?? "",
        cep: locationData?.cep ?? "",
        number: locationData?.number ?? "",
        complement: locationData?.complement ?? "",
      },
      name: completeName,
      cpf: cpfReplaced,
      rg: userData?.rg,
      phone: phoneReplaced,
      dateBorn: userData?.bornDate,
      email: userData?.email,
      firstLetter: completeName?.charAt(0).toUpperCase(),
      id: cpfReplaced,
      profileImage: "",
      role: userData?.role,
      sexo: "NENHUM",
      screeningDate: userData?.screeningDate,
      actualProfessional: "",
      observations,
      anamnese: { ...anamneseData },
      terms: {
        implant: implantTermRead,
        crown: crownTermRead,
      },
      createdBy: {
        timestamp: Timestamp.now(),
        reporterId: adminData?.id,
        reporterName: adminData?.name,
        role: adminData?.role,
      },
    };
    const updated = await createClient(clientData);

    if (updated === "Sucesso") {
      props.setUserUpdating(false);
      props.onClose();
      return alert("Cliente criado com sucesso!");
    } else if (updated === "CPF existente") {
      props.setUserUpdating(false);
      return alert("Cliente já cadastrado no banco de dados.");
    } else {
      props.setUserUpdating(false);
      return alert("Não foi possível criar o cliente.");
    }
  };

  return (
    <Container>
      <IconButton sx={{ alignSelf: "flex-end" }} onClick={props.onClose}>
        <CancelIcon />
      </IconButton>
      {page === 0 && (
        <UserForm
          handleChange={handleChange}
          handleGetCep={handleGetCep}
          handleMasked={handleMasked}
          handleNextPage={handleNextPage}
          locationData={locationData}
          setLocationData={setLocationData}
          userData={userData}
          setUserData={setUserData}
        />
      )}
      {page === 1 && (
        <AnamneseForm
          anamneseData={anamneseData}
          handleAnswer={handleAnswer}
          handleBackPage={handleBackPage}
          handleNextPage={handleNextPage}
          observations={observations}
          setObservations={setObservations}
          userData={userData}
          setUserData={setUserData}
        />
      )}
    </Container>
  );
};

const Container = styled(Box)`
  margin: 24px auto;
  width: 80%;
  padding: 24px 16px;
  border: 2px solid var(--dark-blue);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export default NewPatientForm;
