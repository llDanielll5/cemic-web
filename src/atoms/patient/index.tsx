import { atom } from "recoil";
import { AddressType } from "types";
import { ToothsInterface, TreatmentsPatientInterface } from "types/odontogram";
import { AnamneseQuestions, PatientRole } from "types/patient";

interface AdminInfosProps {
  createTimestamp: string;
  updateTimestamp: string;
  created: any;
  history: any;
  updated: any;
}

interface LecturesInterface {
  data: LecturesDataInterface[];
}

interface LecturesDataInterface {
  id: string;
  attributes: {
    adminInfos: AdminInfosProps;
    createdAt: Date | string;
    dateString: string;
    examRequest: boolean;
    hour: string;
    isMissed: boolean;
    patient: { data: PatientStrapiSingle };
    updatedAt: Date | string;
  };
}

interface OdontogramAllToothsInterface {
  "11": ToothsInterface[] | [];
  "12": ToothsInterface[] | [];
  "13": ToothsInterface[] | [];
  "14": ToothsInterface[] | [];
  "15": ToothsInterface[] | [];
  "16": ToothsInterface[] | [];
  "17": ToothsInterface[] | [];
  "18": ToothsInterface[] | [];

  "21": ToothsInterface[] | [];
  "22": ToothsInterface[] | [];
  "23": ToothsInterface[] | [];
  "24": ToothsInterface[] | [];
  "25": ToothsInterface[] | [];
  "26": ToothsInterface[] | [];
  "27": ToothsInterface[] | [];
  "28": ToothsInterface[] | [];

  "31": ToothsInterface[] | [];
  "32": ToothsInterface[] | [];
  "33": ToothsInterface[] | [];
  "34": ToothsInterface[] | [];
  "35": ToothsInterface[] | [];
  "36": ToothsInterface[] | [];
  "37": ToothsInterface[] | [];
  "38": ToothsInterface[] | [];

  "41": ToothsInterface[] | [];
  "42": ToothsInterface[] | [];
  "43": ToothsInterface[] | [];
  "44": ToothsInterface[] | [];
  "45": ToothsInterface[] | [];
  "46": ToothsInterface[] | [];
  "47": ToothsInterface[] | [];
  "48": ToothsInterface[] | [];

  "Sup. Dir.": ToothsInterface[] | [];
  "Sup. Esq.": ToothsInterface[] | [];
  "Inf. Esq.": ToothsInterface[] | [];
  "Inf. Dir.": ToothsInterface[] | [];
  "Superior Total": ToothsInterface[] | [];
  "Inferior Total": ToothsInterface[] | [];
}

interface OdontogramInterface {
  data: {
    id: string;
    attributes: {
      createdAt: Date | string;
      updatedAt: Date | string;
      treatments: any;
    };
  };
}

export interface Exam {
  id?: any;
  file: any;
  name: String;
}

export interface Problem {
  id?: any;
  file: any;
  title: string;
  description: string;
  date: string;
}

export interface Attachment {
  id?: any;
  file: any;
  name: String;
}

interface DataTreatmentsPatient {
  data: TreatmentsPatientInterface[];
}

interface PatientStrapiSingle {
  id: string;
  attributes: {
    address?: AddressType;
    adminInfos: AdminInfosProps;
    anamnese: AnamneseQuestions;
    cardId: string;
    cpf: string;
    createdAt: Date | string;
    dateBorn: string;
    email: string;
    firstLetter: string;
    lectures: LecturesInterface;
    name: string;
    observations?: string;
    odontogram: OdontogramInterface;
    payments: any | null;
    phone: string;
    profileImage: string;
    rg: string;
    role: PatientRole;
    sexo?: any;
    actualProfessional: any;
    credits?: number;

    screening: any;
    exams: Exam[];
    problems: Problem[];
    attachments: Attachment[];

    treatments: TreatmentsPatientInterface[] | DataTreatmentsPatient;
    forwardedTreatments?: any | null;
  };
}

const PatientData = atom<PatientStrapiSingle | null>({
  key: "PatientData",
  default: null,
});

export default PatientData;
