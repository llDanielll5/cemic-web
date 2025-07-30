type PatientTreatmentStatus =
  | "WAITING"
  | "IN_PROGRESS"
  | "CANCELLED"
  | "FINISHED"
  | "SURGERY_SCHEDULED"
  | "SCHEDULED"
  | "TO_PAY"
  | "CHANGED"
  | "REMAKE"
  | "FORWARDED";

type OdontogramRegions =
  | "t18"
  | "t17"
  | "t16"
  | "t15"
  | "t14"
  | "t13"
  | "t12"
  | "t11"
  | "t21"
  | "t22"
  | "t23"
  | "t24"
  | "t25"
  | "t26"
  | "t27"
  | "t28"
  | "t31"
  | "t32"
  | "t33"
  | "t34"
  | "t35"
  | "t36"
  | "t37"
  | "t38"
  | "t48"
  | "t47"
  | "t46"
  | "t45"
  | "t44"
  | "t43"
  | "t42"
  | "t41"
  | "superior_total"
  | "inferior_total"
  | "inf_dir"
  | "inf_esq"
  | "sup_esq"
  | "sup_dir"
  | "total";

interface PatientTreatmentInterface {
  finishedAt?: string | null;
  finishedBy?: any | null; //dentista
  hasAbsent?: boolean | null; //dente ausente
  hasFinished?: boolean | null;
  hasPayed?: boolean | null;
  name: string;
  obs: string;
  odontogram?: any | null;
  patient?: any | null;
  payment?: any | null;
  price: number;
  region: OdontogramRegions;
  status: PatientTreatmentStatus;
  hasChange?: boolean;
  hasCancelled?: boolean;

  forwardeds?: any | null;
}

interface OdontogramInterface {
  patient: any;
  treatments: ToothsInterface[];
  adminInfos?: AdminInfosInterface;
}

interface ToothsInterface {
  name: string;
  price: number;
  hasPayed?: boolean | null;
  hasFinished?: boolean | null;
  hasAbsent?: boolean | null; //dente ausente
  obs: string;
  finishedAt?: string | null;
  finishedBy?: any | null; //dentista
  patient?: any | null;
  paymentProfessional?: any | null;
  region: OdontogramRegions;
  odontogram?: any | null;
}
