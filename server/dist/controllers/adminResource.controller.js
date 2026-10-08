import { getShelters, createShelter, updateShelter, deleteShelter, getResources, createResource, updateResource, deleteResource, } from "../services/adminResource.service.js";
import { createAuditLog } from "../services/auditLog.service.js";
/* =========================
   SHELTERS
========================= */
export const getSheltersController = async (req, res) => {
    try {
        const shelters = await getShelters();
        return res.status(200).json({
            success: true,
            data: shelters,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch shelters",
        });
    }
};
export const createShelterController = async (req, res) => {
    try {
        const shelter = await createShelter(req.body);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "SHELTER_CREATED",
            details: `Created shelter "${shelter.name}" (${shelter.id}).`,
        });
        return res.status(201).json({
            success: true,
            message: "Shelter created successfully",
            data: shelter,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to create shelter",
        });
    }
};
export const updateShelterController = async (req, res) => {
    try {
        const id = req.params.id;
        const shelter = await updateShelter(id, req.body);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "SHELTER_UPDATED",
            details: `Updated shelter "${shelter.name}" (${shelter.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "Shelter updated successfully",
            data: shelter,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to update shelter",
        });
    }
};
export const deleteShelterController = async (req, res) => {
    try {
        const id = req.params.id;
        const shelter = await deleteShelter(id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "SHELTER_DELETED",
            details: `Deleted shelter "${shelter.name}" (${shelter.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "Shelter deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to delete shelter",
        });
    }
};
/* =========================
   RESOURCES
========================= */
export const getResourcesController = async (req, res) => {
    try {
        const resources = await getResources();
        return res.status(200).json({
            success: true,
            data: resources,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to fetch resources",
        });
    }
};
export const createResourceController = async (req, res) => {
    try {
        const resource = await createResource(req.body);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "RESOURCE_CREATED",
            details: `Created resource "${resource.name}" (${resource.id}) with quantity ${resource.quantity} ${resource.unit}.`,
        });
        return res.status(201).json({
            success: true,
            message: "Resource created successfully",
            data: resource,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to create resource",
        });
    }
};
export const updateResourceController = async (req, res) => {
    try {
        const id = req.params.id;
        const resource = await updateResource(id, req.body);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "RESOURCE_UPDATED",
            details: `Updated resource "${resource.name}" (${resource.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "Resource updated successfully",
            data: resource,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to update resource",
        });
    }
};
export const deleteResourceController = async (req, res) => {
    try {
        const id = req.params.id;
        const resource = await deleteResource(id);
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        await createAuditLog({
            adminId: req.user.id,
            action: "RESOURCE_DELETED",
            details: `Deleted resource "${resource.name}" (${resource.id}).`,
        });
        return res.status(200).json({
            success: true,
            message: "Resource deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Failed to delete resource",
        });
    }
};
//# sourceMappingURL=adminResource.controller.js.map