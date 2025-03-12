import {Request} from 'express'
import dotenv from 'dotenv'
import { WebSocket } from "ws";
import { generateRoomCode } from '../utils/generateRoomCode';
import getUserFingerprint from '../utils/userFingerPrint';
import { createClient } from 'redis';
import redisClient from '../config/redisClient';
import axios from 'axios';
import { rooms } from './ws.service';
import { CustomRequest } from '../types/customRequest';

dotenv.config();

const YOUTUBE_SEARCH_URL = process.env.YOUTUBE_SEARCH_URL;
const YOUTUBE_API_KEY =  process.env.YOUTUBE_API_KEY 

async function joinRoom(req: CustomRequest){
    
    const { roomCode, userFingerPrintId } = req;

    if (!roomCode || !userFingerPrintId) {
        throw new Error('Required Data missing')
    }

    const roomKey = `room:${roomCode}`;

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

async function LeaveRoom(req: CustomRequest){
    const { roomCode, userFingerPrintId } = req;

    if (!roomCode || !userFingerPrintId) {
        throw new Error('Required Data missing')
    }

    const roomKey = `room:${roomCode}`;

    const adminFingerPrint = await redisClient.hGet(roomKey, "adminFingerPrintId");

    if (userFingerPrintId === adminFingerPrint) {

        const result = await redisClient.del(`${roomKey}:users`);
        if (result === 1) {
            return
        } else {
            throw new Error("Room doesn't exists")
        }
    }

    const userExists = await redisClient.sIsMember(`${roomKey}:users`, userFingerPrintId);
    if (userExists) {
        await redisClient.sRem(`${roomKey}:users`, userFingerPrintId);
        return
    }
    else{
        throw new Error("Room left already")
    }

}

async function searchSong(req: Request){
    const query = req.query.q as string;

    if(!query){
        throw new Error('Search Query is required');
    }

    if(!YOUTUBE_SEARCH_URL){
        throw new Error('URL not found')
    }

    const response = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
            part: "snippet",
            q: query,
            key: YOUTUBE_API_KEY,
            type: "video",
            maxResults: 10,
        },
    })
    const videos = response.data.items.map((item:any)=>({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        channel: item.snippet.channelTitle,
    }))
    return videos;
}

async function addToQueue(req: Request){
    const {roomCode, song} = req.body;

    if(!roomCode && !song){
        throw new Error('Roomcode and song required')
    }

    const queueKey = `queue:${roomCode}`;

    await redisClient.rPush(queueKey, JSON.stringify({...song, upvotes: 0}))
    console.log("inside room", rooms);
    if(!rooms.has(roomCode)){
        throw new Error("You are not in the room")
    }


    const queue = await redisClient.lRange(queueKey, 0, -1);
        rooms.get(roomCode)?.forEach((client)=>{
            if(client.readyState ===  WebSocket.OPEN){
                client.send(JSON.stringify({type: 'queueUpdate', queue: queue.map(song => JSON.parse(song))}))
            }
    })
    

}

export {joinRoom, LeaveRoom, searchSong, addToQueue}