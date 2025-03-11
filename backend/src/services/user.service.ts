import {Request} from 'express'
import { generateRoomCode } from '../utils/generateRoomCode';
import getUserFingerprint from '../utils/userFingerPrint';
import { createClient } from 'redis';
import redisClient from '../config/redisClient';

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
    await redisClient.expire(roomKey, 7200); 

    return uniqueRoomCode;
}

async function joinRoom(req: Request){
    
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

    const roomExists = await redisClient.exists(roomKey);
    
    if(!roomExists){
        throw new Error('Wrong Room Code')
    }
    
    const adminFingerPrint = await redisClient.hGet(roomKey, "adminFingerPrintId");

    if (userFingerPrintId === adminFingerPrint) {
        const adminExists = await redisClient.sIsMember(`${roomKey}:users`, adminFingerPrint);
        if (adminExists) {
            throw new Error('Admin is already in room')
        }
        await redisClient.sAdd(`${roomKey}:users`, adminFingerPrint);
        return adminFingerPrint;
    }

    const userExists = await redisClient.sIsMember(`${roomKey}:users`, userFingerPrintId);
    if (userExists) {
        throw new Error('User is already in room')
    }

    await redisClient.sAdd(`${roomKey}:users`, userFingerPrintId);
    return userFingerPrintId
}

export {createRoom, joinRoom}