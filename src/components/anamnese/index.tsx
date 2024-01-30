import React, { useState, useEffect } from "react";
import styles from "../../styles/Selected.module.css";
import { AddressType } from "types";
import UserForm from "../userForm";
import AnamneseForm from "../anamneseForm";
import ImplanteTerm from "../terms/implant";
import CrownTerm from "../terms/crown";
import { updateUserData } from "@/services/requests/firestore";
import { nameCapitalized } from "@/services/services";
import { AnamneseQuestions, AnswerType, PatientInterface } from "types/patient";
import { anamneseQuestions } from "data";

const defaultValues = {
  bornDate: "",
  cpf: "",
  name: "",
  phone: "",
  rg: "",
  sexo: null,
};

interface AnamneseProps {
  userContext?: PatientInterface;
  setAddressLoading: any;
  setUserUpdating: any;
}

const defaultAddress: AddressType = {
  neighbor: "",
  cep: "",
  city: "",
  complement: "",
  line1: "",
  uf: "",
  address: "",
};

const Anamnese = (props: AnamneseProps) => {
  const { userContext } = props;
  const [anamneseData, setAnamneseData] =
    useState<AnamneseQuestions>(anamneseQuestions);
  const [userData, setUserData] = useState<any>(defaultValues);
  const [locationData, setLocationData] = useState<AddressType>(defaultAddress);
  const [observations, setObservations] = useState("");
  const [implantTermRead, setImplantTermRead] = useState(false);
  const [crownTermRead, setCrownTermRead] = useState(false);
  const [page, setPage] = useState(0);

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

  const handleNextPage = () => {
    const notUserCompleted =
      userData.bornDate === "" ||
      userData.cpf?.length! < 14 ||
      userData?.name === "" ||
      userData?.phone?.length! < 14 ||
      userData?.rg?.length! < 6;
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
      anamneseData["Já teve algum problema com anestésicos?"] !== "";

    if (page === 0) {
      if (notUserCompleted)
        return alert("Conclua todos os campos de dados pessoais!");

      if (notLocationCompleted)
        return alert("Você deve preencher um endereço completo válido!");

      return nextPage();
    }

    if (page === 1) {
      if (!hasFinishAnamnese) return alert("Preencha a Anamnese completa!");
      return nextPage();
    }

    if (page === 2) {
      if (!implantTermRead)
        return alert("Você deve ler o termo e concordar para continuar.");
      return nextPage();
    }
    if (page === 3) {
      if (!crownTermRead)
        return alert("Você deve ler o termo e concordar para continuar.");
      return handleFinish();
    }
  };

  const handleBackPage = () => setPage((prev) => prev - 1);

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

    const updatesUser = {
      "address.neighbor": locationData?.neighbor ?? "",
      "address.address": locationData?.address ?? "",
      "address.city": locationData?.city ?? "",
      "address.line1": locationData?.line1 ?? "",
      "address.uf": locationData?.uf ?? "",
      "address.cep": locationData?.cep ?? "",
      "address.number": locationData?.number ?? "",
      "address.complement": locationData?.complement ?? "",
      name: completeName,
      cpf: cpfReplaced,
      rg: userData?.rg,
      phone: phoneReplaced,
      sexo: userData?.sexo,
      dateBorn: userData?.bornDate,
      anamnese: {
        ...anamneseData,
      },
      observations,
      terms: {
        implant: implantTermRead,
        crown: crownTermRead,
      },
      anamneseFilled: true,
    };
    const updated = await updateUserData(userContext?.id!, updatesUser);

    if (updated === "Sucesso") {
      props.setUserUpdating(false);
      return alert("Usuário Atualizado com sucesso!");
    } else {
      props.setUserUpdating(false);
      return alert("Não foi possível atualizar seu cadastro!");
    }
  };

  useEffect(() => {
    const addr = userContext?.address;
    setUserData((prev: any) => ({
      ...prev,
      bornDate: userContext?.dateBorn,
      cpf: cpfMask(userContext?.cpf),
      rg: userContext?.rg,
      name: userContext?.name,
      phone: phoneMask(userContext?.phone),
      sexo: "NENHUM",
    }));
    setLocationData((prev: any) => ({
      ...prev,
      neighbor: addr?.neighbor,
      cep: addr?.cep,
      city: addr?.city,
      line1: addr?.line1,
      complement: addr?.complement,
      uf: addr?.uf,
    }));
  }, [userContext]);

  return (
    <div className={styles["anamnese-container"]}>
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
        />
      )}
      {page === 2 && (
        <ImplanteTerm
          userData={userContext}
          handleBackPage={handleBackPage}
          handleNextPage={handleNextPage}
          implantTermRead={implantTermRead}
          setImplantTermRead={setImplantTermRead}
        />
      )}
      {page === 3 && (
        <CrownTerm
          userData={userContext}
          handleBackPage={handleBackPage}
          handleNextPage={handleNextPage}
          crownTermRead={crownTermRead}
          setCrownTermRead={setCrownTermRead}
        />
      )}
    </div>
  );
};

export default Anamnese;
