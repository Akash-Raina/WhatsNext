import { Request, Response } from "express";
import { createRoom, joinRoom } from "../services/user.service";

async function createRoomApi(req:Request, res: Response){
    try{
        const uniqueRoomCode = await createRoom(req);

        res.status(201).json({
            uniqueRoomCode,
            message: 'Room Created Successfully'
        })
    }
    catch(error:unknown){
        if(error instanceof Error){
            res.status(500).json({
                message: error.message
            })
        }
    }
}

async function joinRoomApi(req: Request, res: Response){
    try{
        const fingerprintId = await joinRoom(req);

        res.status(201).json({
            fingerprintId,
            message: 'Joined successfully'
        })
    }
    catch(error:unknown){
        if(error instanceof Error){
            res.status(500).json({message: error.message})
        }
    }
}

export {createRoomApi, joinRoomApi  }