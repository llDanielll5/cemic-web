import { CreateCashierInfosInterface } from "types/cashier";
import axiosInstance from "..";

export const handleGetCashierOpened = async (
  dateIso: string,
  type: "clinic" | "implant",
  filial: string
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$eq]=${dateIso}&filters[type][$eq]=${type}&filters[hasClosed]=false&filters[filial][$eq]=${filial}&populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*`
  );
};

export const handleGetCashierOpenedWithType = async (
  dateIso: string,
  cashierType: string,
  filial: string
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$eq]=${dateIso}&filters[type][$eq]=${cashierType}&filters[filial][$eq]=${filial}&populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*&populate[patient][fields][0]=name&populate[outInfo][populate]=*`
  );
};

export const handleGetMonthCashiers = async (
  startDate: string,
  endDate: string
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`
  );
};

export const handleGetMonthCashiersOfType = async (
  startDate: string,
  endDate: string,
  filial: string,
  type?: "clinic" | "implant"
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&filters[type]=${type}&filters[filial][$eq]=${filial}&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`
  );
};

export const handleOpenCashierDb = async (data: any) => {
  return await axiosInstance.post(
    `/cashiers/?populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*&populate[patient][fields][0]=name&populate[outInfo][populate]=*`,
    data
  );
};

export const generatePatientPaymentInCashier = async (data: any) => {
  return await axiosInstance.post(`/cashier-infos/`, { data });
};

export const getCashierInfo = async (id: string) => {
  return await axiosInstance.get(
    `/cashier-infos/${id}?populate[cashier][populate]=*`
  );
};

export const deleteCashierInfo = async (id: string) => {
  return await axiosInstance.delete(`/cashier-infos/${id}`);
};

export const handleGetHasOpenedCashier = async (
  startDate: string,
  endDate: string,
  type?: "clinic" | "implant"
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&filters[type]=${type}&filters[hasClosed]=false&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`
  );
};

export const handleCloseCashierOfDay = async (cashierId: string, data: any) => {
  return await axiosInstance.put(`/cashiers/${cashierId}`, { data });
};

export const handleGetLastPayments = async () => {
  return await axiosInstance.get(
    `/cashier-infos/?populate=*&sort[0]=date:desc&pagination[pageSize]=10&filters[type]=IN`
  );
};

export const updateCashierValues = async (id: string, data: any) => {
  return await axiosInstance.put(`/cashiers/${id}`, { data });
};

export const updateCashierInfoValues = async (id: string, data: any) => {
  return await axiosInstance.put(`/cashier-infos/${id}`, { data });
};
