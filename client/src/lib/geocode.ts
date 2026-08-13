import api from "./api";

export const geocodeAddress = async (address: string) => {

  const res = await api.get("/geocode", {
    params: {
      address,
    },
  });

  return res.data.data;
};