import ENV from "@/config/env";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: ENV.BACKEND_BASE_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  },
);

export default axiosClient;
export { axiosClient };
