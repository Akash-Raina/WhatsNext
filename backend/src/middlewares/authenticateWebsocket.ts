import { IncomingMessage } from "http";
import redisClient from "../config/redisClient";
import getUserFingerprint, { getWsUserFingerprint } from "../utils/userFingerPrint";

export const authenticateWebSocket = async (req: IncomingMessage) => {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const roomcode = params.get("roomcode");
    let whoJoined = {user: '', isJoined: false}
    if (!roomcode) {
        console.log("Room code is missing");
        return whoJoined;
    }

    const fingerPrintId =  getWsUserFingerprint(req);
    
    if (!fingerPrintId || Array.isArray(fingerPrintId)) {
        console.log("Fingerprint ID is missing");
        return whoJoined;
    }

    const roomKey = `room:${roomcode}`;
    const roomExists = await redisClient.exists(roomKey);

    if (!roomExists) {
        console.log("Room does not exist in Redis");
        return whoJoined;
    }

    const adminFingerPrint = await redisClient.hGet(roomKey, "adminFingerPrintId");
    if (fingerPrintId === adminFingerPrint) {
        const adminExists = await redisClient.sIsMember(`${roomKey}:users`, adminFingerPrint);
        if (adminExists) {
            whoJoined = {user: 'Admin', isJoined: true}
            return whoJoined;
        }
    }
    const userExists = await redisClient.sIsMember(`${roomKey}:users`, fingerPrintId);

    if (!userExists) {
        console.log("User is not a member of this room");
        return whoJoined;
    }
    whoJoined = {user: 'User', isJoined: true}
    return whoJoined;
};