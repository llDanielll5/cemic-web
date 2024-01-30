import axios from "axios";
import { headerAuth } from "./treatments";

const serverUrl = process.env.DEV_SERVER_URL;

export const handleGetAllDentists = async () => {
  return await axios.post(`${serverUrl}/lectures/?populate=*`, headerAuth);
};

export const getListOfDentists = async () => {
  return await axios.get(
    `${serverUrl}/users-permissions/getDentists`,
    headerAuth
  );
};
