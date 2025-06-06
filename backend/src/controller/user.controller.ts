import { Request, Response } from "express";
import { addToQueue, LeaveRoom, joinRoom, searchSong, upvoteSong } from "../services/user.service";



async function LeaveRoomApi(req: Request, res:Response){
    try{
        await LeaveRoom(req);

        res.status(201).json({
            message: 'Room Leaved Successfully'
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

async function joinRoomApi(req: Request, res: Response){
    try{
        const whoJoined = await joinRoom(req);

        res.status(201).json({
            whoJoined,
            message: 'Joined successfully'
        })
    }
    catch(error:unknown){
        if(error instanceof Error){
            res.status(500).json({message: error.message})
        }
    }
}

async function searchSongApi(req: Request, res: Response){
    try{
        const data = await searchSong(req);

        res.status(200).json({
            data
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

async function addToQueueApi(req: Request, res: Response){
    try{
        await addToQueue(req);
        res.status(201).json({
            message: "Song added to Queue Successfully"
        })
    }
    catch(error:unknown){
        if(error instanceof Error)
            res.status(500).json({
                message: error.message
            })
    }
}

async function upvoteSongApi(req: Request, res: Response){
    try{
        await upvoteSong(req);
        res.status(201).json({
            message : "song upvoted successfully"
        })
    }
    catch(error: unknown){
        if(error instanceof Error){
            res.status(500).json({
                message: error.message
            })
        }
    }
}

export {LeaveRoomApi, joinRoomApi, searchSongApi, addToQueueApi, upvoteSongApi }