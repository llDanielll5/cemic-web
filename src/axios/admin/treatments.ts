import axios from "axios";
import axiosInstance, { serverUrl } from "..";

export const handleGetTreatments = async (currPage?: number) => {
  let page = currPage;
  if (page === 0) page = 1;
  if (page === undefined || page === null) page = 1;
  return await axiosInstance.get(
    `/products?pagination[pageSize]=5&pagination[page]=${page}`
  );
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
