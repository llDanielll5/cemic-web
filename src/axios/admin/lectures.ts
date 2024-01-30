import axios from "axios";
import { serverUrl, headerAuth } from "..";

export const getActualLectureDetails = async (dateString: string) => {
  let data = { dateString };

  return await axios.post(
    `${serverUrl}/lectures/getLecturesByDay`,
    data,
    headerAuth
  );
};

export const schedulePatientLecture = async (data: any) => {
  let { date, participant, hour, admin } = data;

  let dataCreate = { dateString: date, participant, hour, admin };

  return await axios.post(
    `${serverUrl}/lectures/scheduleLecture`,
    dataCreate,
    headerAuth
  );
};

export const getLectureDetails = async (id: string) => {
  return await axios.get(`${serverUrl}/lectures/${id}?populate=*`, headerAuth);
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

  return await axios.put(
    `${serverUrl}/lectures/${id}?populate=*`,
    dataCreate,
    headerAuth
  );
};
