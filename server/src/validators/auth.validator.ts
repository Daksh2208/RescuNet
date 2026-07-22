import { body } from "express-validator";

export const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("phone")
    .trim()
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters"),

  body("role")
    .isIn(["CITIZEN", "VOLUNTEER", "RESCUE", "ADMIN"])
    .withMessage("Invalid role"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];