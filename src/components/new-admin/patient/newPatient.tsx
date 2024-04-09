import React, { useState } from "react";
import { styled, Paper, Typography, Divider } from "@mui/material";
import { AddressType } from "types";
import UserForm from "@/components/userForm";
import { useRecoilValue } from "recoil";
import UserData from "@/atoms/userData";
import {
  getPatientWithSameCardId,
  handleCreatePatient,
} from "@/axios/admin/patients";
import { cpfMask, makeid, phoneMask } from "@/services/services";
import {
  AnamneseQuestions,
  AnswerType,
  allAnamneseQuestions,
} from "types/patient";
import { anamneseQuestions, anamsVal } from "data";
import AnamneseForm from "@/components/admin/patient/components/anamnese-form";
import { getViaCepInfo } from "@/axios/viacep";

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
  role: "PATIENT" | "PRE-REGISTER" | "SELECTED";
  dateBorn: string;
  sexo: string;
  anamnese: any | null;
  screeningDate: string;
  location: "" | "DF" | "MG";
}

interface AnamneseProps {
  onClose: () => void;
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
  role: "PRE-REGISTER",
  sexo: "NENHUM",
  screeningDate: "",
  location: "",
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

const NewPatientForm = (props: AnamneseProps) => {
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const [userData, setUserData] = useState<UserDefaultEdit>(defaultValues);
  const [locationData, setLocationData] = useState<AddressType>(defaultAddress);
  const [observations, setObservations] = useState("");
  const [page, setPage] = useState(0);
  const adminData: any = useRecoilValue(UserData);

  console.log(adminData.location);

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
    const jsonCep = await getViaCepInfo(val);
    if (jsonCep) {
      setLocationData((prev: any) => ({ ...prev, ...jsonCep }));
    }
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

    let hasFinishedAnamnese = false;
    for (let i = 0; i < anamsVal.length; i++) {
      if (anamneseData?.[anamsVal[i] as allAnamneseQuestions] !== "") {
        hasFinishedAnamnese = true;
      } else hasFinishedAnamnese = false;
    }

    if (page === 0) {
      if (notUserCompleted)
        return alert("Conclua todos os campos de dados pessoais!");
      if (userData?.role === "PRE-REGISTER") return handleFinish();

      return nextPage();
    }

    if (page === 1) {
      if (!hasFinishedAnamnese) return alert("Preencha a Anamnese completa!");
      if (userData?.screeningDate === "")
        return alert("Sem data de triagem selecionada");
      return handleFinish();
    }
  };

  const handleFinish = async () => {
    let address = {
      neighbor: locationData?.neighbor ?? "",
      address: locationData?.address ?? "",
      city: locationData?.city ?? "",
      line1: locationData?.line1 ?? "",
      uf: locationData?.uf ?? "",
      cep: locationData?.cep ?? "",
      number: locationData?.number ?? "",
      complement: locationData?.complement ?? "",
    };
    const notLocationCompleted =
      locationData?.city === undefined ||
      locationData?.line1 === undefined ||
      locationData?.neighbor === undefined ||
      locationData?.uf === undefined ||
      locationData?.cep?.length! < 8;

    if (notLocationCompleted) {
      address = {
        neighbor: "",
        address: "",
        city: "",
        line1: "",
        uf: "",
        cep: "",
        number: "",
        complement: "",
      };
    }

    let haveId = 1;
    let cardId = "";

    while (haveId > 0) {
      cardId = makeid(9);
      let hasId = await getPatientWithSameCardId(cardId);
      if (hasId?.data?.data.length === 0) haveId = 0;
    }

    const clientData = {
      address,
      name: userData?.name,
      cpf: userData?.cpf,
      rg: userData?.rg,
      phone: userData?.phone,
      dateBorn: userData?.bornDate,
      email: userData?.email,
      firstLetter: userData?.name?.charAt(0).toUpperCase(),
      profileImage: "",
      role: userData?.role,
      sexo: "NENHUM",
      observations,
      anamnese: { ...anamneseData },
      createdBy: adminData?.id,
      cardId,
      location: adminData?.location,
      slug: userData?.name?.replaceAll(" ", "-").toLowerCase(),
    };

    return await handleCreatePatient(clientData).then(
      (res: any) => {
        if (!!res.alert) return alert(res.alert);
        props.onClose();
      },
      (err) => console.log(err.response)
    );
  };

  return (
    <Container elevation={10}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Novo Paciente
      </Typography>

      <Divider />

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

const Container = styled(Paper)`
  margin: 24px auto;
  width: 90%;
  padding: 24px 16px;
  border: 1px solid #d5d5d5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export default NewPatientForm;
