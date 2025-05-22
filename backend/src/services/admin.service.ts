import redisClient from "../config/redisClient";
import { generateRoomCode } from "../utils/generateRoomCode";
import {getUserFingerprint} from "../utils/userFingerPrint";
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

    await redisClient.expire(roomKey, 10800);
    
    return uniqueRoomCode;
}

async function cancelJoiningRoom(req: Request){
    const {roomCode} = req.body;
    if(!roomCode){
        throw new Error('Room Code is required')
    }

    const userFingerPrintId = getUserFingerprint(req);

    if (!userFingerPrintId) {
        throw new Error("Invalid user fingerprint!");
    }

    const roomKey = `room:${roomCode}`;

    const adminFingerPrint = await redisClient.hGet(roomKey, "adminFingerPrintId");

    if (userFingerPrintId === adminFingerPrint) {
        const result = await redisClient.del(`room:${roomCode}`);
        if (result === 1) {
            return
        } else {
            throw new Error("Room doesn't exists")
        }
    }
}

async function deleteRoom(req:Request) {
    const uniqueRoomCode = req.body.roomCode         
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

export {createRoom, cancelJoiningRoom, deleteRoom}