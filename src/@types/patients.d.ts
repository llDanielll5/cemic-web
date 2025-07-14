type AnswerType = "SIM" | "NÃO" | "NÃO SEI" | "";
type PatientRole = "PRE-REGISTER" | "SELECTED" | "PATIENT" | "BUDGET";
type SexType = "MASCULINO" | "FEMININO" | "NENHUM";

interface PatientInterface {
  id: string;
  cpf: string;
  name: string;
  email: string;
  dateBorn: string;
  firstLetter: string;
  phone: string;
  rg: string;
  sexo?: SexType;
  profileImage: string;
  anamnese: AnamneseQuestions;
  address?: AddressType;
  observations?: string;
  role: PatientRole;
  lectures: any;
  screening: any;
  cardId: string;
  exams?: any;
  problems?: any;
  attachments?: any;
  payments?: any;
  odontogram?: StrapiData<OdontogramInterface> | OdontogramInterface;
  treatments: any;
  slug: string;
  forwardedTreatments: any;
  adminInfos: AdminInfosInterface;
  location?: LOCATION_FILIAL;
  credits: number;
  filial: string;
  dentists: any[];
  fund_credits: FundCreditsInterface[] | StrapiData<FundCreditsInterface>;
}
