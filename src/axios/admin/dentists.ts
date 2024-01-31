import axios from "axios";
import axiosInstance from "..";

export const handleGetAllDentists = async () => {
  return await axiosInstance.post(`/lectures/?populate=*`);
};

export const getListOfDentists = async () => {
  return await axiosInstance.get(`/users-permissions/getDentists`);
};
