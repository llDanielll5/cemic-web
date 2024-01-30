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
