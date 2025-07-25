import { AdminInfosInterface } from "./admin";

export type TransactionType = "IN" | "OUT";

export interface TotalValues {
  credit: number;
  cash: number;
  debit: number;
  pix: number;
  transfer: number;
  bank_check: number;
  out: number;
}

export interface CashierInterface {
  id: string;
  attributes: {
    adminInfos: AdminInfosInterface;
    cashierInfos: { data: any[] };
    createdAt: string;
    date: string;
    hasClosed: boolean;
    type: string;
    updatedAt: string;
    total_values: TotalValues;
  };
}

export interface CashierInfosInterface {
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

export interface CreateCashierInterface {
  data: {
    adminInfos: AdminInfosInterface;
    cashierInfos?: any[];
    hasClosed: boolean;
    date: string;
    type: string;
    total_values: TotalValues;
    filial?: string;
    location?: string;
  };
}

export interface CreateCashierInfosInterface {
  type: "IN" | "OUT";
  date: Date | string;
  total_values: TotalValues;
  description: string;
  verifyBy?: any | null;
  cashier?: any | null;
  outInfo?: any | null;
  patient?: any | null;
  location?: LOCATION_FILIAL;
  filial?: string;
  payment?: any;
  //adicionar pagamento de profisisonal
}

export interface LastPaymentsAdminDashboard {
  id: string;
}
