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
    location,
    filial,
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
      location,
      filial,
      adminInfos: { created: createdBy, createTimestamp: new Date() },
    },
  };
  return await axiosInstance.post(`/patients`, dataCreate);
};

export const handleGetPatients = async (
  filial?: string,
  currPage?: number,
  pageSize?: number,
  sort?: any
) => {
  let page = currPage;
  let size = pageSize;
  let ord = sort;
  let locationFilter = "";
  if (page === 0) page = 1;
  if (size === undefined) size = 10;
  if (!ord || ord === undefined) sort = "asc";
  if (filial !== undefined) locationFilter = `&filters[filial][$eq]=${filial}`;

  return await axiosInstance.get(
    `/patients?pagination[page]=${page}&pagination[pageSize]=${size}&populate=*&sort[0]=name:${sort}${locationFilter}`
  );
};

export const handleFilterPatientByNameOrCpf = async (
  searchValue: string,
  filial?: string
) => {
  let locationFilter = "";
  if (filial !== undefined) locationFilter = `&filters[filial][$eq]=${filial}`;
  return await axiosInstance.get(
    `/patients?filters[$or][0][name][$containsi]=${searchValue}&filters[$or][1][cpf][$eq]=${searchValue}${locationFilter}`
  );
};

export const handleGetSinglePatient = async (
  cardId: string,
  options?: { headers?: any } // permite injetar jwtHeader ou outros headers
) => {
  const populatePayments = (level: number, model: string) => {
    return `populate[payments][populate][${level}]=${model}`;
  };

  const populates = {
    lecture: "populate[lectures][populate]=*",
    address: "populate[address]=*",
    adminInfos:
      "populate[adminInfos][populate][created][fields][0]=name&populate[adminInfos][populate][created][fields][1]=userType&populate[adminInfos][populate][updated][fields][0]=name&populate[adminInfos][populate][updated][fields][1]=userType",
    odontogramTreats: "populate[odontogram][populate][treatments][populate]=*",
    actualProfessional: "populate[actualProfessional]=*",
    screening: "populate[screening][populate]=*",
    odontogramAdmin: "populate[odontogram][populate][adminInfos]=*",
    exams: "populate[exams][populate]=*",
    problems: "populate[problems][populate]=*",
    attachments: "populate[attachments][populate]=*",
    payments: [
      `${populatePayments(0, "cashier_info")}`,
      `${populatePayments(1, "adminInfos")}`,
      `${populatePayments(2, "patient")}`,
      `${populatePayments(3, "bank_check_infos")}`,
      `${populatePayments(4, "treatments")}`,
      `${populatePayments(5, "payment_shapes")}`,
      `populate[payments][populate][6]=fund_credit`,
      `populate[payments][populate][7]=fund_credit.payment`,
      `populate[payments][populate][8]=fund_credit.payment_used`,
      `populate[payments][populate][9]=fund_useds`,
      `populate[payments][populate][10]=fund_useds.payment`,
      `populate[payments][populate][11]=fund_useds.payment.payment_shapes`,
      `populate[payments][populate][12]=fund_credit_payment_useds`,
      `populate[payments][populate][13]=fund_credit_payment_useds.fund_credit`,
      `populate[payments][populate][14]=fund_useds.fund_credit_payment_useds`,
      `populate[payments][populate][15]=payment_shapes.fund_credit`,
      `populate[payments][populate][16]=payment_shapes.fund_credit.payment`,
      `populate[payments][populate][17]=payment_shapes.fund_credit.payment.payment_shapes`,
    ].join("&"),
    treatments: "populate[treatments][populate]=*",
    forwardedTreatments: [
      "populate[forwardedTreatments][populate][treatment]=*",
      "populate[forwardedTreatments][populate][dentist][populate][user]=*",
    ].join("&"),
  };

  const query = [
    `filters[cardId][$eq]=${cardId}`,
    populates.lecture,
    populates.address,
    populates.adminInfos,
    populates.odontogramTreats,
    populates.actualProfessional,
    populates.screening,
    populates.odontogramAdmin,
    populates.exams,
    populates.problems,
    populates.attachments,
    populates.payments,
    populates.treatments,
    populates.forwardedTreatments,
  ].join("&");

  return await axiosInstance.get(`/patients/?${query}`, options);
};

export const handleUpdatePatient = async (id: string, data: any) => {
  return await axiosInstance.put(`/patients/${id}`, { data });
};

export const handleGetPatientCredits = async (id: string) => {
  return await axiosInstance.get(`/patients/${id}`);
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

export const handleGetCountPatientsByDate = async (
  startDate: string,
  endDate: string
) => {
  return await axiosInstance.get(
    `/patients/?filters[createdAt][$gte]=${startDate}&filters[createdAt][$lte]=${endDate}`
  );
};

export const handleUpdateHasPayedTreatments = async (ids: any[]) => {
  return await axiosInstance.post(`/patients/updateHasPayedTreatments`, {
    ids,
  });
};
