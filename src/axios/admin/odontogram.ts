import { defaultOdontogram } from "types/odontogram";
import axiosInstance from "..";

export const getOdontogramDetails = async (odontogramId: any) => {
  return await axiosInstance.get(`/odontograms/${odontogramId}`);
};

export const handleCreateOdontogram = async (patientId: any) => {
  let data = { data: defaultOdontogram(patientId) };
  return await axiosInstance.post(`/odontograms`, data);
};

export const updateToothOfPatient = async (
  odontogramId: string,
  values: any,
  adminInfos: any
) => {
  let data = { data: { tooths: values, adminInfos } };
  return await axiosInstance.put(`/odontograms/${odontogramId}`, data);
};
