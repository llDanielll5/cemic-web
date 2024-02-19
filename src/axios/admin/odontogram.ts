import { defaultOdontogram } from "types/odontogram";
import { AdminInfosInterface } from "types/admin";
import axiosInstance from "..";

export const getOdontogramDetails = async (
  odontogramId: any,
  region: string
) => {
  let params = `&populate[tooths][populate][${region}][populate]=*`;
  return await axiosInstance.get(`/odontograms/${odontogramId}/?${params}`);
};

export const handleCreateOdontogram = async (patientId: any, adminId: any) => {
  let adminInfos = { created: adminId, createTimestamp: new Date() };
  let data = { data: { patient: patientId, adminInfos } };
  return await axiosInstance.post(`/odontograms`, data);
};

export const updateToothOfPatient = async (
  odontogramId: string,
  data: any,
  adminInfos: any
) => {
  let dataUpdate = {
    data: {
      valuesToAdd: data.values,
      adminInfos,
      odontogramId,
    },
  };
  return await axiosInstance.post(`/odontograms/updateTooth`, dataUpdate);
};

export const handleGetTreatmentsToPay = async (odontogramId: string) => {
  return await axiosInstance.post(`/odontograms/getTreatmentsToPay`, {
    data: { odontogramId },
  });
};
