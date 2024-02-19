export interface PaymentShape {
  type: PaymentTypes;
  value?: number;
  valueStr?: string;
}

export type PaymentTypes = "debit" | "pix/cash" | "credit";

export interface PaymentMethod {
  total?: string;
  type?: PaymentTypes;
  dates?: Date[];
  subvalues?: string | string[];
}

export interface AcquittanceType {
  clientId: string;
  date: Date;
  treatments?: any[];
  description: string;
  payment_method?: PaymentMethod;
}

//*****************************************************REMOVER A PARTE ACIMA
//                      POSTERIORMENTE**** */

export type PaymentShapeTypes =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "CASH"
  | "PIX"
  | "BANK_CHECK"
  | "TRANSFER"
  | "";

export interface BankCheckInformationsInterface {
  name: string;
  serie_number: string;
  bank_check_number: string;
  date_compensation: Date | string;
  price?: string;
}
export interface PaymentInfosInterface {
  id?: string;
  card_value: number;
  cash_value: number;
  credit_value: number;
  pix_value: number;
  transfer_value: number;
  card_split_times: number;
  bank_check_value: number;
  bank_check_split_times: number;
  bank_check_informations: BankCheckInformationsInterface[];
}

export interface PaymentShapesInterface {
  shape: PaymentShapeTypes;
  price: number;
  split_times?: number;
  discount?: number;
}

export interface PaymentInterface {
  data: {
    attributes: {
      date: Date | string;
      total_value: number;
      infos: PaymentInfosInterface;
      payment_shapes: PaymentShapesInterface[];
    };
    id: string;
  };
}
