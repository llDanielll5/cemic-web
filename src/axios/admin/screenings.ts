import axios from "axios";
import { getCookie } from "cookies-next";
import { headerAuth } from "./treatments";
import { formatISO } from "date-fns";

const serverUrl = process.env.DEV_SERVER_URL;

export const handleUpdatePatientPresenceOfScreening = async (
  isMissed: boolean,
  id: string
) => {
  const data = { data: { isMissed } };
  return await axios.put(`${serverUrl}/screenings/${id}`, data, headerAuth);
};

export const schedulePatientScreening = async (data: any) => {
  return await axios.post(
    `${serverUrl}/screenings/schedule-patient`,
    data,
    headerAuth
  );
};

export const getDayScreening = async (dateSelected: any) => {
  let dateIso = formatISO(dateSelected).substring(0, 10);
  return await axios.get(
    `${serverUrl}/screenings?populate=*&filters[dateString][$eq]=${dateIso}`,
    headerAuth
  );
};

export const updateScreeningTreatment = async (id: string, data: any) => {
  return await axios.put(`${serverUrl}/screenings/${id}`, data, headerAuth);
};
