import { body } from "express-validator";

export const createIncidentValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 150 }),


    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 5000 }),

    body("disasterType")
        .isIn([
            "FLOOD",
            "EARTHQUAKE",
            "FIRE",
            "CYCLONE",
            "LANDSLIDE",
            "OTHER",
        ])
        .notEmpty()
        .withMessage("Disaster type is required"),

    body("severity")
        .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
        .notEmpty()
        .withMessage("Severity is required"),

    body("latitude")
        .isFloat({ min: -90, max: 90 })
        .isFloat(),

    body("longitude")
        .isFloat({ min: -180, max: 180 })
        .isFloat(),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Incident location is required")
        .isLength({ max: 500 }),

    body("target")
        .optional()
        .isIn(["HUMAN", "ANIMAL", "BOTH"])
        .withMessage("Invalid incident target"),

    body("reporterName")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 }),

    body("reporterPhone")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 20 }),

];

