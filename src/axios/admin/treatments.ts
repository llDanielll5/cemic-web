import axios from "axios";
import axiosInstance, { serverUrl } from "..";

export const handleGetTreatments = async (
  currPage?: number,
  pageSize?: string
) => {
  let page = currPage;
  if (page === 0) page = 1;
  if (page === undefined || page === null) page = 1;
  return await axiosInstance.get(
    `/products?pagination[pageSize]=${pageSize ?? "5"}&pagination[page]=${page}`
  );
};

export const handleGetTreatmentsByName = async (name: string) => {
  const url = `/products?filters[name][$contains]=${name}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const handleGetOneTreatment = async (id: string) => {
  return await axiosInstance.get(`/products/${id}`);
};

export const handleCreateTreatment = async (data: any) => {
  const { price, name } = data;
  let dataCreate = { data: { price, name } };

  return await axiosInstance.post(`/products`, dataCreate);
};

export const handleDeleteTreatment = async (id: string) => {
  return await axiosInstance.delete(`/products/${id}`);
};

export const handleEditTreatment = async (id: string, data: any) => {
  const { price, name } = data;
  let dataCreate = { data: { price, name } };

  return await axiosInstance.put(`/products/${id}`, dataCreate);
};

export const handleGetTreatmentsOfPatient = async (patientId: string) => {
  return await axiosInstance.get(
    `/patient-treatments/?filters[patient][id][$eq]=${patientId}&pagination[pageSize]=999&populate[payment][populate]=*&populate[finishedBy][populate]=*`
  );
};
