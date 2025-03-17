import { Request, Response } from "express";
import { createRoom, deleteRoom } from "../services/admin.service";

async function createRoomApi(req:Request, res: Response){
    try{
        const roomCode = await createRoom(req);

        res.status(201).json({
            roomCode,
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

async function deleteRoomApi(req: Request, res:Response){
    try{
        await deleteRoom(req);

        res.status(201).json({
            message: 'Room Deleted Successfully'
        })
    }
    catch(error:unknown){
        if(error instanceof Error){
            res.status(500).json({
                message : error.message
            })
        }
    }
}

export {createRoomApi, deleteRoomApi}