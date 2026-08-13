import api from "./api";

export const reportIncident = (data: any) => {
  console.log("Data received by reportIncident:", data);
  console.log("Same object?", data.imageUrl);
  api.post("/incidents", data);
}

export const getMyReports = () =>
  api.get("/incidents/my");

export const getIncident = (id: string) =>
  api.get(`/incidents/${id}`);

export const getRadarIncidents = async () => {
  const response = await api.get("/incidents/radar");
  return response.data.data;
};