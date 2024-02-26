import axiosInstance from "..";

export const createPatientPayment = async (dataUpdate: any) => {
  return await axiosInstance.post("/payments/", dataUpdate);
};
