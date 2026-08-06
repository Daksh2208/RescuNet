import axios from "axios";
import { getAccessToken, setAccessToken } from "./token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {

    const token = getAccessToken();

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            const response = await api.post("/auth/refresh");

            setAccessToken(
                response.data.accessToken
            );

            originalRequest.headers.Authorization =
                `Bearer ${response.data.accessToken}`;

            return api(originalRequest);

        }

        return Promise.reject(error);

    }

);

export default api;