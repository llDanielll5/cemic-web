type DENTIST_SPECIALTIES =
  | "GENERAL" // Clínica geral
  | "ORTHODONTIC" // Ortodontia
  | "IMPLANT" // Implantodontia
  | "PROSTHESIS" // Prótese
  | "ENDODONTIC" // Endodontia
  | "PERIODONTIC" // Periodontia
  | "PEDIATRIC" // Odontopediatria
  | "SURGERY" // Cirurgia bucomaxilofacial
  | "RADIOLOGY" // Radiologia odontológica
  | "PATHOLOGY" // Patologia bucal
  | "PUBLIC_HEALTH" // Saúde coletiva
  | "STOMATOLOGY" // Estomatologia
  | "DENTAL_AESTHETICS" // Dentística (estética)
  | "GERIATRIC" // Odontogeriatria
  | "FORENSIC" // Odontologia legal
  | "ACUPUNCTURE" // Acupuntura odontológica
  | "LASER" // Laserterapia
  | "HOMEOPATHY" // Homeopatia
  | "HYPNOSIS" // Hipnose odontológica
  | ""; // Vazio/opcional

interface DentistInterface {
  percent: number;
  specialty: DENTIST_SPECIALTIES;
  cro: string;
  patients?: any;
  forwarded_treatments?: any;
  payments?: any;
  user?: AdminType | StrapiRelation<StrapiData<AdminType>>;
  id?: string;
}

interface DentistStrapiAttributes {
  percent: number;
  specialty: DENTIST_SPECIALTIES;
  cro: string;
  createdAt: string;
  updatedAt: string;
  user: StrapiRelation<StrapiData<AdminType>>;
  forwarded_treatments: StrapiListRelation<any>;
  patients: StrapiListRelation<any>;
}

interface DentistUserInterface extends DentistInterface, AdminType {}

interface CreatePatientBudgetDentist {
  date: Date;
  dentist: number;
  patient: number;
  isCompleted: boolean;
}

interface PatientToBudgetInterface {
  date: string;
  dentist: DentistInterface | StrapiRelationData<DentistInterface>;
  patient: PatientInterface | StrapiRelationData<PatientInterface>;
  isCompleted: boolean;
  patient_treatments?:
    | PatientTreatmentInterface
    | StrapiListRelationData<PatientTreatmentInterface>;
}
