import { AddressType, TreatmentPlanInterface, TreatmentProps } from "types";
import { AdminInfosInterface } from "./admin";

export type AnswerType = "SIM" | "NÃO" | "NÃO SEI" | "";
export type PatientRole = "PRE-REGISTER" | "SELECTED" | "PATIENT";
export type SexType = "MASCULINO" | "FEMININO" | "NENHUM";
export type allAnamneseQuestions =
  | "Está tomando alguma medicação no momento?"
  | "Sofre ou sofreu de algum problema no coração?"
  | "É diabético?"
  | "Possui dificuldade de cicatrização?"
  | "Tem ou teve alguma doença nos rins ou fígado?"
  | "Sofre de epilepsia?"
  | "Já esteve hospitalizado por algum motivo?"
  | "Tem anemia?"
  | "É alérgico a algum medicamento?"
  | "Já teve algum problema com anestésicos?"
  | "Tem ansiedade?"
  | "Faz uso de AAS?"
  | "É fumante?"
  | "Consome bebidas alcoólicas?"
  | "É Hipertenso?"
  | "Está gravida?";

export interface AnamneseQuestions {
  "Está tomando alguma medicação no momento?": AnswerType;
  "Sofre ou sofreu de algum problema no coração?": AnswerType;
  "É diabético?": AnswerType;
  "Possui dificuldade de cicatrização?": AnswerType;
  "Tem ou teve alguma doença nos rins ou fígado?": AnswerType;
  "Sofre de epilepsia?": AnswerType;
  "Já esteve hospitalizado por algum motivo?": AnswerType;
  "Tem anemia?": AnswerType;
  "É alérgico a algum medicamento?": AnswerType;
  "Já teve algum problema com anestésicos?": AnswerType;
  "Tem ansiedade?": AnswerType;
  "Faz uso de AAS?": AnswerType;
  "É fumante?": AnswerType;
  "Consome bebidas alcoólicas?": AnswerType;
  "É Hipertenso?": AnswerType;
  "Está gravida?": AnswerType;
}

export interface PatientTreatments {
  all: TreatmentPlanInterface[];
  toDo: TreatmentPlanInterface[];
  inProgress: TreatmentPlanInterface[];
}

export interface PatientFinishedTreatments {
  region: string;
  treatment: TreatmentProps;
  dentist: any;
  finishedAt: Date;
}

export interface PatientInterface {
  id: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  phone: string;
  sexo?: SexType;
  dateBorn: string;
  profileImage: string;
  firstLetter: string;
  anamnese: AnamneseQuestions;
  address?: AddressType;
  role: PatientRole;
  anamneseFilled?: boolean;
  observations?: string;
  actualProfessional: any;
  lectures: any;
  adminInfos: AdminInfosInterface;
  screening: any;
  cardId: string;
  finishedTreatments: PatientFinishedTreatments[];
  treatments: PatientTreatments;
  payments: any;
  treatmentPlan: TreatmentPlanInterface[];
  forwardedTreatment: any;
}

interface PatientPaymentsHistoryInterface {
  date: Date;
  paymentShape: string;
  value: number;
  receipt: string | number;
}
export interface PatientPaymentsInterface {
  total: number;
  history: PatientPaymentsHistoryInterface[];
}
export interface ReceiptsInterface {
  timestamp: Date;
  treatments: [];
  value: number;
  asign: any;
}

export interface PatientAttributes {
  name: string;
  email: string;
  dateBorn: string;
  phone: string;
  cpf: string;
  rg: string;
  role: string;
  address: string;
}
