import crypto from "crypto";
import { Request } from "express";
import dotenv from 'dotenv'
import { IncomingMessage } from "http";

dotenv.config();

const getUserFingerprint = (req: Request ) => {
    const userSecret = process.env.USER_SECRET as string;
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";

  
    return crypto.createHash("sha256").update(userSecret + ip).digest("hex");
};

export const getWsUserFingerprint = (req: IncomingMessage)=>{
    const userSecret = process.env.USER_SECRET as string;
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] || 
    req.socket.remoteAddress || "unknown-ip";
    return crypto.createHash("sha256").update(userSecret + ip).digest("hex");
}

export default getUserFingerprint