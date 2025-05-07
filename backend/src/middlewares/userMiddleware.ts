import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisClient";
import getUserFingerprint from "../utils/userFingerPrint";
import { CustomRequest } from "../types/customRequest";


export function extractRoomCode(req: CustomRequest, res: Response, next: NextFunction) {
    const {roomCode} = req.body

    if (!roomCode) {
        res.status(400).json({ error: "Room code is required!" });
        return
    }

    req.roomCode = roomCode; 
    next();
}

export function validateUserFingerprint(req: CustomRequest, res: Response, next: NextFunction) {
    const userFingerPrintId = getUserFingerprint(req);

    if (!userFingerPrintId) {
        res.status(403).json({ error: "Invalid user fingerprint!" });
        return
    }

    req.userFingerPrintId = userFingerPrintId;
    next();
}


export const userAuth = async( req: Request, res: Response, next: NextFunction)=>{

    const {roomCode} = req.body;
    const userFingerPrint = getUserFingerprint(req);
    const roomKey = `room:${roomCode}`;

    const roomExists = await redisClient.exists(roomKey);

    if(!roomExists){
        res.status(400).json({
            message: 'Wrong Room Code'
        })
        return
    }

    const userExists = await redisClient.sIsMember(`${roomKey}:users`, userFingerPrint);
    if (!userExists) {
        res.status(400).json({
            message: 'Authentication Failed'
        })
        return
    }

    next();
}
