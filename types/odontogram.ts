export interface ToothsInterface {
  id?: string;
  name: string;
  price: number;
  hasPayed?: boolean | null;
  hasFinished?: boolean | null;
  finishedBy?: any | null; //dentista
  finishedAt?: string | null;
  hasAbsent?: boolean | null; //dente ausente
  createdIn?: string | Date;
  obs: string;
  region: OdontogramRegions;
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
  tooths: ToothsInterface[];
}

export const defaultOdontogram = (patientId?: string) => {
  return {
    patient: patientId,
    tooths: {
      "11": [],
      "12": [],
      "13": [],
      "14": [],
      "15": [],
      "16": [],
      "17": [],
      "18": [],

      "21": [],
      "22": [],
      "23": [],
      "24": [],
      "25": [],
      "26": [],
      "27": [],
      "28": [],

      "31": [],
      "32": [],
      "33": [],
      "34": [],
      "35": [],
      "36": [],
      "37": [],
      "38": [],

      "41": [],
      "42": [],
      "43": [],
      "44": [],
      "45": [],
      "46": [],
      "47": [],
      "48": [],

      "Sup. Dir.": [],
      "Sup. Esq.": [],
      "Inf. Esq.": [],
      "Inf. Dir.": [],
      "Superior Total": [],
      "Inferior Total": [],
    },
  };
};
