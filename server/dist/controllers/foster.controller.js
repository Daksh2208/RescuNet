import { getAllOpenFosterRequests, createFosterRequest, applyToFoster, } from "../services/foster.service.js";
export const getFosterRequests = async (req, res) => {
    try {
        const medicalNeeds = req.query.medicalNeeds === "true" ? true : req.query.medicalNeeds === "false" ? false : undefined;
        const requests = await getAllOpenFosterRequests(medicalNeeds);
        return res.status(200).json({
            success: true,
            requests,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch foster requests",
        });
    }
};
export const createFoster = async (req, res) => {
    try {
        const userId = req.user.id;
        const request = await createFosterRequest(req.body, userId);
        return res.status(201).json({
            success: true,
            message: "Foster request created successfully",
            request,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create foster request",
        });
    }
};
export const applyFosterController = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updatedRequest = await applyToFoster(id, userId);
        return res.status(200).json({
            success: true,
            message: "Foster application submitted successfully",
            request: updatedRequest,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to apply for foster",
        });
    }
};
//# sourceMappingURL=foster.controller.js.map