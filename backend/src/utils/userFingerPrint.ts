import crypto from "crypto";
import { Request } from "express";

const getUserFingerprint = (req: Request ) => {
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
  
    return crypto.createHash("sha256").update(userAgent + ip).digest("hex");
};

export default getUserFingerprint