import axios from "axios";

import { getToken } from "utils/LocalStorageHandle";

export const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

const request = (options = {}) => {
  axiosClient.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;
  axiosClient.defaults.headers.common["clientId"] =
    sessionStorage.getItem("client_id");
  if (options.headers) {
    axiosClient.defaults.headers = {
      ...axiosClient.defaults.headers,
      ...options.headers,
    };
  }

  return axiosClient;
};

export default request;
