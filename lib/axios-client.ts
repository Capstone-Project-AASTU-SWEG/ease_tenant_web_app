import ENV from "@/config/env";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: ENV.NEXT_PUBLIC_BACKEND_BASE_URL,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const payload = config.data;
    console.log("/n/nPAYLOAD:", payload, "\n\n");

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
