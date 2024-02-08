import axios from "axios";

export const getIP = async () => {
  const response = await axios.get("https://api.ipify.org?format=json");
  if (response.data.ip) return response.data.ip;
  else return null;
};
