// let accessToken = localStorage.getItem("accessToken") || "";

// export const setAccessToken = (token: string) => {

//     accessToken = token;

//     if (token) {

//         localStorage.setItem("accessToken", token);

//     } else {

//         localStorage.removeItem("accessToken");

//     }

// };

// export const getAccessToken = () => {
//     return accessToken;
// };

let accessToken = "";

export const setAccessToken = (token: string) => {
  accessToken = token;

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }
};

export const getAccessToken = () => {
  // Restore token from browser storage when running on client
  if (typeof window !== "undefined" && !accessToken) {
    accessToken = localStorage.getItem("accessToken") || "";
  }

  return accessToken;
};