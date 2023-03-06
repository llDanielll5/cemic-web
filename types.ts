export type UserRole = "admin" | "client" | "professional" | "employee";

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
  cep: string;
  address: string;
  line1: string;
  neighbor: string;
  city: string;
  uf: string;
  complement: string;
}

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
  address: AddressType | {};
  xrays: XRaysType[];
  role: UserRole;
}
