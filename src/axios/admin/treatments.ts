import axios from "axios";
import { headerAuth, serverUrl } from "..";

export const handleGetTreatments = async (currPage?: number) => {
  let page = currPage;
  if (page === 0) page = 1;
  if (page === undefined || page === null) page = 1;
  return await axios.get(
    `${serverUrl}/products?pagination[pageSize]=5&pagination[page]=${page}`,
    headerAuth
  );
};

export const handleGetOneTreatment = async (id: string) => {
  return await axios.get(`${serverUrl}/products/${id}`, headerAuth);
};

export const handleCreateTreatment = async (data: any) => {
  const { price, name } = data;
  let dataCreate = { data: { price, name } };

  return await axios.post(`${serverUrl}/products`, dataCreate, headerAuth);
};

export const handleDeleteTreatment = async (id: string) => {
  return await axios.delete(`${serverUrl}/products/${id}`, headerAuth);
};

export const handleEditTreatment = async (id: string, data: any) => {
  const { price, name } = data;
  let dataCreate = { data: { price, name } };

  return await axios.put(`${serverUrl}/products/${id}`, dataCreate, headerAuth);
};
