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

interface TreatmentsClient {
  treatment_plan: TreatmentPlanInterface[] | [];
  forwardeds: TreatmentPlanInterface[] | [];
  realizeds: any[];
}

export interface ForwardingHistoryInterface {
  timestamp: Timestamp;
  reporter: string;
  client: string;
  reporter_name: string;
  professional: string;
  professional_name: string;
  treatments: TreatmentPlanInterface[] | [];
  realizeds: TreatmentPlanInterface[] | [];
  medias: any[];
  id: string;
  problems: any[];
}

export interface ClientTreatmentsProps {
  id: string;
  medias: any[];
  client: string;
  screeningId: string;
  updatedAt: Timestamp;
  // forwardingHistory: ForwardingHistoryInterface[] | []; //histórico de encaminhamento
  actualProfessional: string;
  professionalScreening: string;
  treatments: TreatmentsClient;
  negotiateds: TreatmentPlanInterface[] | [];
}
export interface ClientType {
  id: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  phone: string;
  profileImage: string;
  firstLetter: string;
  anamnese: any;
  address?: AddressType;
  role: ClientRole;
  dateBorn: string;
  sexo?: SexType;
  anamneseFilled?: boolean;
  observations?: string;
  terms?: {
    implant?: boolean;
    crown?: boolean;
  };
}

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
  dateBorn: string;
}

export interface ClientLectureDay {
  client: string;
  isMissed: boolean;
}
export interface LectureDay {
  clients: ClientLectureDay[];
  day: Timestamp;
}

export interface PatientSelected {
  clientId: string;
  hour: string;
  isMissed: boolean;
  name: string;
  phone: string;
}
export interface ScreeningDayProps {
  date: string;
  reporter_id: string;
  reporter_name: string;
}

export interface PaymentMethod {
  total?: string;
  type?: PaymentTypes;
  dates?: Date[];
  subvalues?: string | string[];
}
export interface TreatmentPlanInterface {
  region: string;
  treatments: TreatmentProps;
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

export type SpecialtyType =
  | "implant"
  | "orthodontic"
  | "general"
  | "prosthesis";

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
  specialty: SpecialtyType;
}

export type PaymentTypes = "debit" | "pix" | "cash" | "credit";

export interface AcquittanceType {
  clientId: string;
  date: Timestamp;
  treatments?: any[];
  description: string;
  payment_method?: PaymentMethod;
}

export interface TreatmentProps {
  cod: string;
  name: string;
  price: string;
}

export interface PaymentShape {
  type: PaymentTypes;
  value?: number;
  valueStr?: string;
}

export interface ReceiptProps {
  patientId: string;
  timestamp: Timestamp;
  screeningId: string | null;
  negotiateds: TreatmentPlanInterface[];
  paymentShape: PaymentShape[];
  paymentId?: string;
  id?: string;
  total: number;
  totalStr: string;
}
