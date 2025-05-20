// utils/getClientIp.ts
import { Request } from "express";
import { IncomingMessage } from "http";

export const extractIp = (req: Request | IncomingMessage): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  // Fallback for WebSocket or Express without proxy
  return req.socket?.remoteAddress || "unknown-ip";
};
