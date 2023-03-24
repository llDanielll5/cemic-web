import { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "client" | "professional" | "employee";
export type ClientRole = "pre-register" | "selected" | "patient";

export interface AdminType {
  uid: string;
  name: string;
  surname: string;
  email: string;
  token: string;
  role: UserRole;
  id: string;
  profileImage: string;
}

export type XRaysType = {
  [date: string]: any[];
};

export type AnamneseType = "Sim" | "Não" | "Não Sei";

//viacep types
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

export interface FinanceType {}

export type SexType = "MASCULINO" | "FEMININO" | "NENHUM";

export interface ClientType {
  uid: string;
  id: string;
  name: string;
  email: string;
  profileImage: string;
  cpf: string;
  rg: string;
  phone: string;
  firstLetter: string;
  treatments: string[];
  reports: string[];
  protocols: string[];
  anamnese: AnamneseType[];
  address?: AddressType;
  xrays: XRaysType[];
  finances: FinanceType[];
  role: ClientRole;
  dateBorn: string;
  sexo: SexType;
  lectureDays: string[];
}

export interface ClientLectureDay {
  client: string;
  isMissed: boolean;
}
export interface LectureDay {
  clients: ClientLectureDay[];
  day: Timestamp;
}
