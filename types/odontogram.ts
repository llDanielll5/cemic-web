export interface ToothsInterface {
  name: string;
  price: number;
  hasPayed?: boolean | null;
  hasFinished?: boolean | null;
  finishedBy?: any | null; //dentista
  finishedAt?: string | null;
  hasAbsent?: boolean | null; //dente ausente
  createdIn?: string | Date;
  obs: string;
}

export interface OdontogramInterface {
  patient: any;
  tooths: {
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
  };
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
