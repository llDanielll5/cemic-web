type PaymentShapeTypes =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "CASH"
  | "PIX"
  | "BANK_CHECK"
  | "TRANSFER"
  | "WALLET_CREDIT"
  | "";

interface PaymentsInterface {
  adminInfos: any;
  date: Date;
  patient: any;
  total_value: number;
  discount: number;
  description: string;
  payment_shapes: PaymentShapesInterface[];
  bank_check_infos: any[];
  cashier_info?: any;
  hasFundCredit?: boolean;
  hasFundPayed?: boolean;
  fund_credit?: FundCreditsInterface;
  fund_useds?:
    | StrapiListRelation<StrapiData<FundCreditsInterface>>
    | FundCreditsInterface[];
  treatments?: PatientTreatmentInterface;
}

interface PaymentShapesInterface {
  id?: string;
  shape: PaymentShapeTypes;
  price: number;
  split_times?: number;
  creditAdditional?: number;
  creditAdditionalValue?: number;
  fundCredits?: any;
}
