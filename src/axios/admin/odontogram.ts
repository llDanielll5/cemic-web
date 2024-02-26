import axiosInstance from "..";

export const handleCreateOdontogram = async (patientId: any, adminId: any) => {
  let adminInfos = { created: adminId, createTimestamp: new Date() };
  let data = { data: { patient: patientId, adminInfos } };
  return await axiosInstance.post(`/odontograms`, data);
};

export const updateOdontogramDetails = async (
  odontogramId: string,
  adminInfos: any
) => {
  let dataUpdate = { data: { adminInfos } };
  return await axiosInstance.put(`/odontograms/${odontogramId}`, dataUpdate);
};

export const handleGetTreatmentsToPay = async (patientId: string) => {
  return await axiosInstance.get(
    `/patient-treatments/?filters[patient][id][$eq]=${patientId}&populate[payment][populate]=*&pagination[pageSize]=999`
  );
};
