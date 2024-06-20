import axiosInstance from "..";

export const updatePatientTreatments = async (values: any) => {
  return await axiosInstance.post("/patient-treatments", values);
};

export const getRegionDetails = async (patientId: string, region: string) => {
  return await axiosInstance.get(
    `/patient-treatments/?filters[patient][id][$eq]=${patientId}&filters[region][$eq]=${region}&populate[payment][populate]=*&populate[forwardeds][populate]=*&populate[finishedBy][populate]=*&populate[finishedHistory][populate]=*`
  );
};

export const handleDeletePatientTreatmentById = async (treatmentId: string) => {
  return await axiosInstance.delete(`/patient-treatments/${treatmentId}`);
};

export const handleGetHistoryPatientTreatmentById = async (
  treatmentId: string
) => {
  return await axiosInstance.get(
    `/patient-treatments/${treatmentId}/?populate[payment]=*`
  );
};

export const handleGetTreatmentsOfPatientToFinish = async (
  patientId: string
) => {
  return await axiosInstance.get(
    `/forwarded-treatments/?filters[patient][id][$eq]=${patientId}&populate[dentist][populate]=*&populate[adminInfos][populate]=*&populate[treatments][populate]=*`
  );
};

export const handleGetFinishedTreatmentsOfPatient = async (
  patientId: string
) => {
  return await axiosInstance.get(
    `/finished-treatments/?filters[patient][id][$eq]=${patientId}&populate[dentist][populate]=*&populate[treatments][populate]=*&populate[paymentDentist][populate]=*`
  );
};

export const handleFinishTreatmentsOfPatient = async (data: any) => {
  return await axiosInstance.post(`/finished-treatments/`, { data });
};

export const updateFinishedBy = async () => {
  //finishedBy of treatments
};
