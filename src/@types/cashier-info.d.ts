type FundCreditsStatus = "USED" | "CREATED" | "PARTIAL_USED";

interface CashierInfosInterface {
  type: TransactionType;
  date: string;
  total_values: TotalValues;
  description: string;
  location: any | null;
  filial: string | null;
  createdAt: string;
  updatedAt: string;
  cashier: CashierInterface;
}

interface BankCheckInformationsInterface {
  name: string;
  serie_number: string;
  bank_check_number: string;
  date_compensation: Date | string;
  price?: string;
}

interface ReceiptValues {
  paymentShapes: PaymentShapesInterface[];
  treatmentsForPayment: ToothsInterface[];
  bankCheckInfos: BankCheckInformationsInterface[];
  totalValue?: number;
  discount?: number;
  dateSelected?: Date;
  cashierType: CASHIER_TYPE;
  creditsUsed?: number;
}
