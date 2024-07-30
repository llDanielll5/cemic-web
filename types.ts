import { Timestamp } from "firebase/firestore";
import { UserPermissionsJsonInterface } from "types/admin";

export type UserRole =
  | "ADMIN"
  | "EMPLOYEE"
  | "DENTIST"
  | "PROSTHETIC"
  | "SUPERADMIN";
export type AnamneseType = "Sim" | "Não" | "Não Sei";
export type DentistSpecialties =
  | "IMPLANT"
  | "PROSTHESIS"
  | "ORTHODONTIC"
  | "GENERAL"
  | "";

export interface PaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export interface AddressType {
  cep?: string;
  address?: string;
  line1?: string;
  neighbor?: string;
  city?: string;
  uf?: string;
  complement?: string;
  number?: string;
}

export type XRaysType = {
  [date: string]: any[];
};

export interface AdminType {
  uid: string;
  id: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  phone: string;
  profileImage: string;
  firstLetter: string;
  role: UserRole;
  location: "" | "DF" | "MG";
  filial?: string;
  dateBorn: string;
  userType: UserRole;
  permissions: UserPermissionsJsonInterface;
}

export interface TreatmentProps {
  name: string;
  price: number;
}
export interface TreatmentPlanInterface {
  region: string;
  treatment: TreatmentProps;
}
export interface ScreeningInformations {
  id?: string;
  name: string;
  phone: string;
  date: string;
  hour: string;
  patientId: string;
  isMissed: boolean | null;
  total_value: string;
  hasPay: boolean | null;
  paymentId: string[];
  receiptId: string[];
  observations: string;
  professionalId: string;
  professional_name: string;
  treatment_plan: TreatmentPlanInterface[] | [];
  negotiated: any[];
  reporter_name: string;
  reporter_id: string;
}

export interface ProfessionalData {
  name: string;
  phone: string;
  cpf: string;
  rg: string;
  cro: string;
  email: string;
  uid: string;
  id: string;
  profileImage: string;
  firstLetter: string;
  treatments: string[];
  payments: string[];
  protocols: string[];
  role: UserRole;
  specialty: DentistSpecialties;
}
