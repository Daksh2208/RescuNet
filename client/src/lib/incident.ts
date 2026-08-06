import api from "./api";

export const reportIncident = (data: any) =>
  api.post("/incidents", data);

export const getMyReports = () =>
  api.get("/incidents/my");

export const getIncident = (id: string) =>
  api.get(`/incidents/${id}`);