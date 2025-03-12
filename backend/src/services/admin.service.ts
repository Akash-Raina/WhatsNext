import redisClient from "../config/redisClient";
import { generateRoomCode } from "../utils/generateRoomCode";
import getUserFingerprint from "../utils/userFingerPrint";
import { Request } from "express";

async function createRoom(req: Request){

    const uniqueRoomCode = generateRoomCode();

    if(!uniqueRoomCode)
        throw new Error('Why would this even happen')

    const adminFingerPrintId = getUserFingerprint(req);

    if (!adminFingerPrintId) {
        throw new Error( "Failed to generate admin ID.");
    }

    const roomKey = `room:${uniqueRoomCode}`;
    await redisClient.hSet(roomKey, { adminFingerPrintId, createdAt: Date.now() });

    return uniqueRoomCode;
}

async function deleteRoom(req:Request) {
    const params = new URLSearchParams(req.url?.split("?")[1]);
    const uniqueRoomCode = params.get('roomcode')          
    if (!uniqueRoomCode) {
        throw new Error("Room code is required!");
    }
    const userFingerPrintId = getUserFingerprint(req);

    if (!userFingerPrintId) {
        throw new Error("Invalid user fingerprint!");
    }

    const roomKey = `room:${uniqueRoomCode}`;

    const adminFingerPrint = await redisClient.hGet(roomKey, "adminFingerPrintId");

    if (userFingerPrintId === adminFingerPrint) {

        const result = await redisClient.del(`${roomKey}:users`);
        if (result === 1) {
            return
        } else {
            throw new Error("Room doesn't exists")
        }
    }

}
export {createRoom, deleteRoom}