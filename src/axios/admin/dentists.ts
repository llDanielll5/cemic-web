import axios from "axios";
import axiosInstance from "..";

export const handleGetAllDentists = async () => {
  return await axiosInstance.get(`/dentists/?populate=*`);
};

export const getListOfDentists = async () => {
  return await axiosInstance.get(`/users-permissions/getDentists`);
};

export const getDentistSingle = async (dentistId: string) => {
  return await axiosInstance.get(
    `/users/${dentistId}/?populate[forwardedTreatments][populate]=*&populate[finisheds][populate]=*&populate[payments][populate]=*`
  );
};

export const handleCreateForwardPatientTreatments = async (data: any) => {
  return await axiosInstance.post(`/forwarded-treatments`, { data });
};

export const createNewDentist = async (data: any) => {
  return await axiosInstance.post(`/dentists`, { data });
};

export const getAllDentists = async () => {
  return await axiosInstance.get(
    `/dentists?populate[user]=*&populate[forwarded_treatments]=*&populate[patients]=*`
  );
};

export const getSingleDentist = async (id: string) => {
  return await axiosInstance.get(
    `/dentists/${id}?populate[user]=*&populate[forwarded_treatments]=*&populate[patients]=*`
  );
};
