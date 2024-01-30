import axios from "axios";
import { headerAuth, serverUrl } from "..";

export const handleGetAllDentists = async () => {
  return await axios.post(`${serverUrl}/lectures/?populate=*`, headerAuth);
};

export const getListOfDentists = async () => {
  return await axios.get(
    `${serverUrl}/users-permissions/getDentists`,
    headerAuth
  );
};
