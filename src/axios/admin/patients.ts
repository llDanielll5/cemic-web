import axios from "axios";
import { nameCapitalized } from "@/services/services";
import { serverUrl, headerAuth } from "..";

export const handleCreatePatient = async (data: any) => {
  const {
    address,
    name,
    cpf,
    rg,
    phone,
    dateBorn,
    email,
    firstLetter,
    profileImage,
    sexo,
    observations,
    anamnese,
    role,
    createdBy,
    cardId,
  } = data;

  const phoneReplaced = phone!
    .replace("(", "")
    .replace(")", "")
    .replace("-", "")
    .replace(" ", "");
  const cpfReplaced = cpf!.replace(".", "").replace("-", "").replace(".", "");

  const completeName = nameCapitalized(name!);

  let hasRegistered = await axios.get(
    `${serverUrl}/patients?filters[cpf][$eq]=${cpfReplaced}`,
    headerAuth
  );

  if (hasRegistered.data.data.length > 0)
    return { alert: "Já possui um Paciente cadastrado com este CPF!" };

  let dataCreate = {
    data: {
      rg,
      sexo,
      role,
      email,
      cardId,
      address,
      dateBorn,
      anamnese,
      firstLetter,
      profileImage,
      observations,
      name: completeName,
      cpf: cpfReplaced,
      phone: phoneReplaced,
      adminInfos: { created: createdBy, createTimestamp: new Date() },
      treatments: {
        all: [],
        toDo: [],
        inProgress: [],
        negotiateds: [],
        forwardeds: [],
      },
    },
  };
  return await axios.post(`${serverUrl}/patients`, dataCreate, headerAuth);
};

export const handleGetPatients = async (
  currPage?: number,
  pageSize?: number,
  sort?: any
) => {
  let page = currPage;
  let size = pageSize;
  let ord = sort;
  if (page === 0) page = 1;
  if (size === undefined) size = 10;
  if (!ord || ord === undefined) sort = "asc";
  // let hasFilter =
  //   filters !== null
  //     ? `&filters[role][$eq]=${filters}`
  //     : filters === undefined
  //     ? ""
  //     : "";

  return await axios.get(
    `${serverUrl}/patients?pagination[page]=${page}&pagination[pageSize]=${size}&populate=*&sort[0]=name:${sort}`,
    headerAuth
  );
};

export const handleGetPatientByCPF = async (cpf: string) => {
  return await axios.get(
    `${serverUrl}/patients?filters[cpf]=${cpf}`,
    headerAuth
  );
};

export const handleGetSinglePatient = async (id: string) => {
  //TODO AUMENTAR OS POPULATES DE ACORDO COM O AUMENTO DE INFORMAÇÕES DO PACIENTE NO DB
  return await axios.get(
    `${serverUrl}/patients/${id}?populate[lectures][populate]=*&populate[address]=*&populate[adminInfos][populate]=*&populate[finishedTreatments]=*`,
    headerAuth
  );
};

export const handleUpdatePatient = async (id: string, data: any) => {
  return await axios.put(`${serverUrl}/patients/${id}`, data, headerAuth);
};

export const handleGetPatientTreatments = async (id: string) => {
  return await axios.get(
    `${serverUrl}/patients/${id}?populate[treatments][populate]=*&populate[screening][populate]=*`,
    headerAuth
  );
};

export const getPatientWithSameCardId = async (cardId: string) => {
  return await axios.get(
    `${serverUrl}/patients/?filters[cardId]=${cardId}`,
    headerAuth
  );
};
