import axios from "axios";
import { getCookie } from "cookies-next";

export const serverUrl = process.env.DEV_SERVER_URL;

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: serverUrl, timeout: 7000 });
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || `Ocorreu um erro ${error}`
    )
);

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = serverUrl;
    let jwt = getCookie("jwt");
    if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
    return config;
  },
  (error) => Promise.reject(error)
);
export default axiosInstance;

const fundCreditPaymentUseds = "fund-credit-payment-useds";

export const endpoints = {
  HOME: "/",
  ADMIN: "/admin",
  FUND_CREDIT_PAYMENT_USED: {
    FIND: `/${fundCreditPaymentUseds}`,
    FIND_ONE: (id: string) => `/${fundCreditPaymentUseds}/${id}`,
    DELETE: (id: string) => `/${fundCreditPaymentUseds}/${id}`,
    CREATE: `/${fundCreditPaymentUseds}`,
    UPDATE: (id: string) => `/${fundCreditPaymentUseds}/${id}`,
  },
};
