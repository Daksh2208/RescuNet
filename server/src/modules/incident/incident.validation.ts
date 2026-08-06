import { body } from "express-validator";

export const createIncidentValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("disasterType")
        .notEmpty()
        .withMessage("Disaster type is required"),

    body("severity")
        .notEmpty()
        .withMessage("Severity is required"),

    body("latitude")
        .isFloat(),

    body("longitude")
        .isFloat(),

    body("address")
        .trim()
        .notEmpty(),

];

