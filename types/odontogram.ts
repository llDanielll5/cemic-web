export interface ToothsInterface {
  id?: string;
  attributes: {
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
  };
}

export type OdontogramRegions =
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
  | "sup_dir";

export interface OdontogramInterface {
  patient: any;
  treatments: ToothsInterface[];
}

export interface TreatmentsPatientInterface {
  id?: string;
  name: string;
  price: number;
  hasPayed?: boolean | null;
  hasFinished?: boolean | null;
  hasAbsent?: boolean | null; //dente ausente
  obs: string;
  finishedAt?: string | null;
  finishedBy?: any | null; //dentista
  patient?: any | null;
  paymentsProfessional?: any | null;
  region: OdontogramRegions;
  odontogram?: any | null;
  payment?: any | null;
}
