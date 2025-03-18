import crypto from "crypto";
import { Request } from "express";
import { IncomingMessage } from "http";

const getUserFingerprint = (req: Request ) => {
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
  
    return crypto.createHash("sha256").update(userAgent + ip).digest("hex");
};

export const getWsUserFingerprint = (req: IncomingMessage)=>{
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || 
    req.socket.remoteAddress || "unknown";

    return crypto.createHash("sha256").update(userAgent + ip).digest("hex");
}

export default getUserFingerprint