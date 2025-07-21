import axiosInstance from "..";

interface CreateFundCreditValues {
  payment: number;
  status: FundCreditsStatus;
  payment_used?: number;
  patient: string;
  used_value: number;
  hasUsed: boolean;
  max_used_value: number;
}

export const createPatientPayment = async (dataUpdate: any) => {
  return await axiosInstance.post("/payments/", dataUpdate);
};

export const getPatientsFinishedsForDentist = async (dentistId: string) => {
  return await axiosInstance.get(
    `/patients/?filters[finishedTreatments][dentist][id][$eq]=${dentistId}&filters[payments][treatments][finishedHistory][dentist][id][$eq]=${dentistId}&populate[payments][populate][treatments][populate][finishedHistory][populate]=*`
  );
};

export const deletePatientPayment = async (id: string) => {
  return await axiosInstance.delete(`/payments/${id}`);
};

export const createPatientFundCredit = async (data: CreateFundCreditValues) => {
  return await axiosInstance.post(`/fund-credits`, { data });
};

export const getPatientFundCredits = async (patientId: string) => {
  return await axiosInstance.get(
    `/fund-credits?filters[patient][id][$eq]=${patientId}&filters[$or][0][status][$eq]=PARTIAL_USED&filters[$or][1][status][$eq]=CREATED&populate[payment][populate]=*`
  );
};

export const updateFundCreditsUsedValues = async (data: {
  fundCredits: StrapiData<FundCreditsInterface>[];
  paymentId: number;
  fund_credits: number[];
  paymentShapes: PaymentShapesInterface[];
  patient: string;
}) => {
  return await axiosInstance.post(`/payment/updateFundCreditsUsedValues`, data);
};

export const deletePatientFundCredit = async (id: string) => {
  return await axiosInstance.delete(`/fund-credits/${id}`);
};
type UpdatePatientFundCredit = {
  used_value: number;
  status: FundCreditsStatus;
  hasUsed: boolean;
};
export const updatePatientFundCredit = async (
  id: string,
  data: UpdatePatientFundCredit
) => {
  return await axiosInstance.put(`/fund-credits/${id}`, { data });
};

export const deletePatientUsedFundCredit = async (id: string) => {
  return await axiosInstance.delete(`fund-credit-payment-useds/${id}`);
};
type UpdatePatientUsedFundCredit = {
  used_value: number;
};
export const updatePatientUsedFundCredit = async (
  id: string,
  data: UpdatePatientUsedFundCredit
) => {
  return await axiosInstance.put(`/fund-credit-payment-useds/${id}`, { data });
};
