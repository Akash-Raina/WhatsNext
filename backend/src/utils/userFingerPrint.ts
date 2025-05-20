// utils/userFingerprint.ts
import crypto from "crypto";
import dotenv from "dotenv";
import { Request } from "express";
import { IncomingMessage } from "http";
import { extractIp } from "./getClientIp";

dotenv.config();

const userSecret = process.env.USER_SECRET as string;

export const getUserFingerprint = (req: Request | IncomingMessage) => {
  const ip = extractIp(req);
  return crypto.createHash("sha256").update(userSecret + ip).digest("hex");
};
