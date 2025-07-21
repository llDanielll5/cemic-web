import { AdminInfosInterface } from "./admin";
import { ToothsInterface, TreatmentsPatientInterface } from "./odontogram";

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
  | "WALLET_CREDIT"
  | "";
type PaymentStringBr =
  | "Pix"
  | "Cartão de Crédito"
  | "Cartão de Débito"
  | "Dinheiro"
  | "Cheque"
  | "Transferência Bancária"
  | "Fundos de Crédito"
  | "";

export const paymentShapeTypeString: Record<
  PaymentShapeTypes,
  PaymentStringBr
> = {
  BANK_CHECK: "Cheque",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  PIX: "Pix",
  TRANSFER: "Transferência Bancária",
  WALLET_CREDIT: "Fundos de Crédito",
  "": "",
};

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
  treatments?: TreatmentsPatientInterface[];
}

export interface PaymentShapesInterface {
  id?: string;
  shape: PaymentShapeTypes;
  price: number;
  split_times?: number;
  creditAdditional?: number;
  fundCredits?: StrapiData<FundCreditsInterface>;
  creditAdditionalValue?: number;
  fundCreditPaymentShapes?: PaymentShapesInterface[];
}

export interface PaymentInterface {
  data: {
    attributes: {
      date: Date | string;
      total_value: number;
      infos: PaymentInfosInterface;
      payment_shapes: PaymentShapesInterface[];
      patient: any;
      adminInfos: AdminInfosInterface;
      treatments: ToothsInterface[];
    };
    id: string;
  };
}

export interface ReceiptValues {
  paymentShapes: PaymentShapesInterface[];
  treatmentsForPayment: ToothsInterface[];
  bankCheckInfos: BankCheckInformationsInterface[];
  totalValue?: number;
  discount?: number;
  dateSelected?: Date;
  cashierType: CASHIER_TYPE;
  creditsUsed?: number;
}
