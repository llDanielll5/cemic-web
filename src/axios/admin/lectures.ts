import axios from "axios";
import axiosInstance, { serverUrl } from "..";

export const getActualLectureDetails = async (date: Date) => {
  return await axiosInstance.get(`/lectures?filters[date][$eq]=${date}`);
};

export const schedulePatientLecture = async (data: any) => {
  let { date, participant, hour, admin } = data;
  let dataCreate = { dateString: date, participant, hour, admin };

  return await axiosInstance.post(`/lectures/scheduleLecture`, dataCreate);
};

export const getLectureDetails = async (id: string) => {
  return await axiosInstance.get(`/lectures/${id}?populate=*`);
};

export const updateSingleLecture = async (id: string, data: any) => {
  let { admin, examRequest, isMissed } = data;
  let dataCreate = {
    data: {
      adminInfos: { updated: admin, updateTimestamp: new Date() },
      examRequest,
      isMissed,
    },
  };

  return await axiosInstance.put(`/lectures/${id}?populate=*`, dataCreate);
};
