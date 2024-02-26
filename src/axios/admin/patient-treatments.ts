import axiosInstance from "..";

export const updatePatientTreatments = async (values: any) => {
  return await axiosInstance.post("/patient-treatments", values);
};

export const getRegionDetails = async (patientId: string, region: string) => {
  return await axiosInstance.get(
    `/patient-treatments/?fiters[patient][id][$eq]=${patientId}&filters[region][$eq]=${region}`
  );
};
