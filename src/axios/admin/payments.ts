import axiosInstance from "..";

export const createPatientPayment = async (dataUpdate: any) => {
  return await axiosInstance.post("/payments/", dataUpdate);
};

export const getPatientsFinishedsForDentist = async (dentistId: string) => {
  return await axiosInstance.get(
    `/patients/?filters[finishedTreatments][dentist][id][$eq]=${dentistId}&filters[payments][treatments][finishedHistory][dentist][id][$eq]=${dentistId}&populate[payments][populate][treatments][populate][finishedHistory][populate]=*`
  );
};
