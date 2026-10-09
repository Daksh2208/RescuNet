// import axios from "axios";
// import { getAccessToken, setAccessToken } from "./token";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach access token
// api.interceptors.request.use((config) => {
//   const token = getAccessToken();

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Handle expired access token
// api.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     // If there is no request config, just reject
//     if (!originalRequest) {
//       return Promise.reject(error);
//     }

//     const requestUrl = originalRequest.url || "";

//     // Never try to refresh for authentication endpoints
//     const isAuthRequest =
//       requestUrl.includes("/auth/login") ||
//       requestUrl.includes("/auth/register") ||
//       requestUrl.includes("/auth/refresh") ||
//       requestUrl.includes("/auth/logout");

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !isAuthRequest
//     ) {
//       originalRequest._retry = true;

//       try {
//         const response = await api.post("/auth/refresh");

//         const newAccessToken =
//           response.data.accessToken;

//         setAccessToken(newAccessToken);

//         originalRequest.headers.Authorization =
//           `Bearer ${newAccessToken}`;

//         return api(originalRequest);

//       } catch (refreshError) {

//         // Refresh token is invalid/expired
//         setAccessToken("");
//         if (typeof window !== "undefined") {
//           const publicPaths = ["/", "/login", "/register", "/forgot-password"];
//           const isPublicPath = publicPaths.includes(window.location.pathname);
//           if (!isPublicPath) {
//             window.location.href = "/login";
//           }
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


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

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout");

    if (error.response?.status !== 401 || isAuthRequest) {
      return Promise.reject(error);
    }

    // A public request that receives 401 must not trigger
    // a token refresh when there is no access token.
    const currentToken = getAccessToken();

    if (!currentToken) {
      return Promise.reject(error);
    }

    // Do not retry the same request repeatedly.
    if (originalRequest._retry) {
      setAccessToken("");
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await api.post("/auth/refresh");
      const newAccessToken = response.data.accessToken;

      if (!newAccessToken) {
        throw new Error("Refresh response did not contain an access token");
      }

      setAccessToken(newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      setAccessToken("");

      // Only redirect when the visitor is on a protected page.
      if (typeof window !== "undefined") {
        const publicPaths = [
          "/",
          "/login",
          "/register",
          "/forgot-password",
          "/report-emergency",
        ];

        const isPublicPath = publicPaths.includes(
          window.location.pathname
        );

        if (!isPublicPath) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
