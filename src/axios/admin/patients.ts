import axios from "axios";
import { nameCapitalized } from "@/services/services";
import axiosInstance from "..";

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

  let hasRegistered = await axiosInstance.get(
    `/patients?filters[cpf][$eq]=${cpfReplaced}`
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
    },
  };
  return await axiosInstance.post(`/patients`, dataCreate);
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

  return await axiosInstance.get(
    `/patients?pagination[page]=${page}&pagination[pageSize]=${size}&populate=*&sort[0]=name:${sort}`
  );
};

export const handleGetPatientByCPF = async (cpf: string) => {
  return await axiosInstance.get(`/patients?filters[cpf]=${cpf}`);
};

export const handleGetSinglePatient = async (cardId: string) => {
  const populates = {
    lecture: "populate[lectures][populate]=*",
    address: "populate[address]=*",
    adminInfos: "populate[adminInfos][populate]=*",
    odontogramTreats: "populate[odontogram][populate][treatments][populate]=*",
    actualProfessional: "populate[actualProfessional]=*",
    screening: "populate[screening][populate]=*",
    odontogramAdmin: "populate[odontogram][populate][adminInfos]=*",
    exams: "populate[exams][populate]=*",
    problems: "populate[problems][populate]=*",
    attachments: "populate[attachments][populate]=*",
    payments: "populate[payments][populate]=*",
    treatments: "populate[treatments][populate]=*",
  };

  const {
    lecture,
    address,
    adminInfos,
    odontogramTreats,
    actualProfessional,
    screening,
    odontogramAdmin,
    exams,
    problems,
    attachments,
    payments,
    treatments,
  } = populates;

  return await axiosInstance.get(
    `/patients/?filter[cardId][$eq]=${cardId}&${lecture}&${address}&${adminInfos}&${odontogramTreats}&${actualProfessional}&${screening}&${odontogramAdmin}&${exams}&${problems}&${attachments}&${payments}&${treatments}`
  );
};

export const handleUpdatePatient = async (id: string, data: any) => {
  return await axiosInstance.put(`/patients/${id}`, data);
};

export const handleGetPatientTreatments = async (id: string) => {
  return await axiosInstance.get(
    `/patients/${id}?populate[treatments][populate]=*&populate[screening][populate]=*`
  );
};

export const getPatientWithSameCardId = async (cardId: string) => {
  return await axiosInstance.get(`/patients/?filters[cardId]=${cardId}`);
};

export const uploadFile = async (file: FormData, type?: string) => {
  return await axiosInstance.post("/upload/", file, {
    headers: {
      "Content-Type": type ?? "application/pdf",
    },
  });
};

export const getFiles = async () => {
  return await axiosInstance.get(`/upload/files/`);
};

export const getSingleFile = async (id: string) => {
  return await axiosInstance.get(`/upload/files/${id}`);
};

export const deleteFile = async (id: string) => {
  return await axiosInstance.delete(`/upload/files/${id}`);
};
