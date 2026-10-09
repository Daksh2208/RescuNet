// import api from "./api";

// export const reportIncident = (data: any) => {
//   console.log("Data received by reportIncident:", data);
//   console.log("Same object?", data.imageUrl);
//   api.post("/incidents", data);
// }

// export const getMyReports = () =>
//   api.get("/incidents/my");

// export const getIncident = (id: string) =>
//   api.get(`/incidents/${id}`);

// export const getRadarIncidents = async () => {
//   const response = await api.get("/incidents/radar");
//   return response.data.data;
// };

// export const reportPublicIncident = async (data: {
//   title: string;
//   description: string;
//   disasterType: string;
//   severity: string;
//   latitude: number;
//   longitude: number;
//   address: string;
//   target: "HUMAN" | "ANIMAL" | "BOTH";
//   reporterName?: string;
//   reporterPhone?: string;
// }) => {
//   const response = await api.post("/incidents/public", data);
//   return response.data;
// };


import api from "./api";

export const reportIncident = (data: any) => {
  return api.post("/incidents", data);
};

export const reportPublicIncident = (data: any) => {
  return api.post("/incidents/public", data);
};

export const getMyReports = () => api.get("/incidents/my");

export const getIncident = (id: string) =>
  api.get(`/incidents/${id}`);

export const getRadarIncidents = async () => {
  const response = await api.get("/incidents/radar");
  return response.data.data;
};
