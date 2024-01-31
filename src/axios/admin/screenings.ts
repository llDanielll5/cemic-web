import axios from "axios";
import { formatISO } from "date-fns";
import axiosInstance, { serverUrl } from "..";

export const handleUpdatePatientPresenceOfScreening = async (
  isMissed: boolean,
  id: string
) => {
  const data = { data: { isMissed } };
  return await axiosInstance.put(`/screenings/${id}`, data);
};

export const schedulePatientScreening = async (data: any) => {
  return await axiosInstance.post(`/screenings/schedule-patient`, data);
};

export const getDayScreening = async (dateSelected: any) => {
  let dateIso = formatISO(dateSelected).substring(0, 10);
  return await axiosInstance.get(
    `/screenings?populate=*&filters[dateString][$eq]=${dateIso}`
  );
};

export const updateScreeningTreatment = async (id: string, data: any) => {
  return await axiosInstance.put(`/screenings/${id}`, data);
};
