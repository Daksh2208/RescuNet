let accessToken = localStorage.getItem("accessToken") || "";

export const setAccessToken = (token: string) => {

    accessToken = token;

    if (token) {

        localStorage.setItem("accessToken", token);

    } else {

        localStorage.removeItem("accessToken");

    }

};

export const getAccessToken = () => {
    return accessToken;
};