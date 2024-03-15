import { CreateCashierInfosInterface } from "types/cashier";
import axiosInstance from "..";

export const handleGetCashierOpened = async (
  dateIso: string,
  type: "clinic" | "implant"
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$eq]=${dateIso}&filters[type][$eq]=${type}&populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*`
  );
};

export const handleGetCashierOpenedWithType = async (
  dateIso: string,
  cashierType: string
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$eq]=${dateIso}&filters[type][$eq]=${cashierType}&populate[adminInfos][populate]=*&populate[cashierInfos][populate]=*&populate[patient][fields][0]=name&populate[outInfo][populate]=*`
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
  type?: "clinic" | "implant"
) => {
  return await axiosInstance.get(
    `/cashiers/?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&filters[type]=${type}&populate[cashierInfos][populate]=*&populate[adminInfos][populate]=*`
  );
};

export const handleOpenCashierDb = async (data: any) => {
  return await axiosInstance.post("/cashiers", data);
};

export const generatePatientPaymentInCashier = async (data: any) => {
  return await axiosInstance.post(`/cashier-infos/`, data);
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
