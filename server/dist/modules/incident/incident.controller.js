import { createIncident, getIncidentById, getMyIncidents } from "./incident.service.js";
import { getRadarIncidents as getRadarIncidentsService, } from "./incident.service.js";
export const reportIncident = async (req, res) => {
    try {
        console.log("Controller req.body:", req.body);
        const incident = await createIncident(req.body, req.user.id);
        return res.status(201).json({
            success: true,
            message: "Incident reported successfully",
            data: incident,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to report incident",
        });
    }
};
export const getMyReports = async (req, res) => {
    try {
        const incidents = await getMyIncidents(req.user.id);
        return res.status(200).json({
            success: true,
            data: incidents,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch reports",
        });
    }
};
export const getIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const incident = await getIncidentById(id, req.user.id);
        return res.status(200).json({
            success: true,
            data: incident,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Incident not found",
        });
    }
};
export const getRadarIncidents = async (req, res) => {
    try {
        const incidents = await getRadarIncidentsService();
        return res.status(200).json({
            success: true,
            data: incidents,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch radar incidents",
        });
    }
};
//# sourceMappingURL=incident.controller.js.map