// utils/userFingerprint.ts
import crypto from "crypto";
import dotenv from "dotenv";
import { Request } from "express";
import { IncomingMessage } from "http";
import { extractIp } from "./getClientIp";
import { parse } from "url";

dotenv.config();

const userSecret = process.env.USER_SECRET as string;

export const getUserFingerprint = (req: Request | IncomingMessage) => {
  let uid = "anonymous";
  if("headers" in req && req.headers['x-uid']) {
    uid = req.headers['x-uid'] as string;
  }
  if (!uid || uid === "anonymous") {
    const url = parse(req.url || "", true);
    console.log("URL:", url);
    if (url.query.uid) {
      uid = url.query.uid as string;
      console.log("Query UID:", uid);
    }
  }

  const ip = extractIp(req);
  return crypto.createHash("sha256").update(userSecret + ip + uid).digest("hex");
};
