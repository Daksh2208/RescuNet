import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (
  payload: object
) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (
  payload: object
) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (
  token: string
) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (
  token: string
) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};