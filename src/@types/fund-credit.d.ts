interface FundCreditPaymentUsedInterface {
  date: string;
  used_value: number;
  payment_shapes: PaymentShapesInterface[];
  patient?: StrapiData<PatientInterface> | PatientInterface;
  fund_credit?: StrapiRelationData<FundCreditsInterface> | FundCreditsInterface;
  payment?: StrapiRelationData<PaymentInterface> | PaymentsInterface;
}

interface FundCreditsInterface {
  payment: StrapiRelationData<PaymentsInterface> | PaymentsInterface;
  payment_used: PaymentsInterface;
  status: FundCreditsStatus;
  patient?: patient;
  used_value: number;
  hasUsed: boolean;
  max_used_value: number;
  fund_credit_payment_useds?:
    | StrapiListRelationData<FundCreditPaymentUsedInterface>
    | FundCreditPaymentUsedInterface;
}
