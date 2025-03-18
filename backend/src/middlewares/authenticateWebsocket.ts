import { IncomingMessage } from "http";
import redisClient from "../config/redisClient";
import getUserFingerprint, { getWsUserFingerprint } from "../utils/userFingerPrint";

export const authenticateWebSocket = async (req: IncomingMessage) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const roomcode = params.get("roomcode");

    if (!roomcode) {
        console.log("Room code is missing");
        return false;
    }

    const fingerPrintId =  getWsUserFingerprint(req);
    
    console.log('fingerprint', fingerPrintId);
    if (!fingerPrintId || Array.isArray(fingerPrintId)) {
        console.log("Fingerprint ID is missing");
        return false;
    }

    const roomKey = `room:${roomcode}`;
    const roomExists = await redisClient.exists(roomKey);

    if (!roomExists) {
        console.log("Room does not exist in Redis");
        return false;
    }

    const userExists = await redisClient.sIsMember(`${roomKey}:users`, fingerPrintId);

    if (!userExists) {
        console.log("User is not a member of this room");
        return false;
    }

    return true;
};