import axios from "axios";
import { getCookie } from "cookies-next";

const serverUrl = process.env.DEV_SERVER_URL;

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: serverUrl });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || `Ocorreu um erro ${error}`
    )
);

axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('accessToken') || '';
    const jwt = getCookie("jwt");
    if (jwt) config.headers.Authorization = `Bearer ${jwt}`;

    config.xsrfCookieName = "csrftoken";
    config.xsrfHeaderName = "X-CSRFToken";
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
