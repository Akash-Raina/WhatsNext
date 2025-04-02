import {Request} from 'express'
import dotenv from 'dotenv'
import { WebSocket } from "ws";
import { generateRoomCode } from '../utils/generateRoomCode';
import getUserFingerprint from '../utils/userFingerPrint';
import { createClient } from 'redis';
import redisClient from '../config/redisClient';
import axios from 'axios';
import { broadcastQueueUpdate, rooms } from './ws.service';
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
        return {
            id: adminFingerPrint,
            user: 'Admin'
        };
    }

    const userExists = await redisClient.sIsMember(`${roomKey}:users`, userFingerPrintId);
    if (userExists) {
        throw new Error('User is already in room')
    }

    await redisClient.sAdd(`${roomKey}:users`, userFingerPrintId);
    return {
        id: userFingerPrintId,
        user: 'User'
    }
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
    const query = req.query.query as string;

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

async function addToQueue(req: Request) {
    const { roomCode, song } = req.body;

    if (!roomCode || !song) {
        throw new Error('RoomCode and song are required');
    }

    const userFingerPrint = getUserFingerprint(req);

    const queueKey = `queue:${roomCode}`;
    const songKey = `queue:${roomCode}:${song.id}`;

    const exists = await redisClient.exists(songKey);
    if (exists) {
        throw new Error("Song already in queue.");
    }

    await redisClient.rPush(queueKey, song.id);
    await redisClient.hSet(songKey, { title: song?.title || "unknown", upvotes: 1, thumbnail: song?.thumbnail || null, channel: song?.channel || "unkown",  upvotedBy: userFingerPrint});

    if (rooms.has(roomCode)) {
        const queue = await getUpdatedQueue(roomCode);
        broadcastQueueUpdate(roomCode, queue);
    }
}

async function upvoteSong(req: Request) {
    const { roomCode, songId } = req.body;

    if (!roomCode || !songId) {
        throw new Error("RoomCode, songId are required");
    }
    const userFingerPrint = getUserFingerprint(req);

    const songKey = `queue:${roomCode}:${songId}`;

    const exists = await redisClient.exists(songKey);
    if (!exists) {
        throw new Error("Song not found in queue.");
    }

    const upvotedBy = await redisClient.hGet(songKey, "upvotedBy");

    const upvotedUsers = new Set(upvotedBy ? upvotedBy.split(",") : []);

    if (upvotedUsers.has(userFingerPrint)) {
        throw new Error("You have already upvoted this song.");
    }

    upvotedUsers.add(userFingerPrint);
    await redisClient.hSet(songKey, {
        upvotes: await redisClient.hIncrBy(songKey, "upvotes", 1),
        upvotedBy: Array.from(upvotedUsers).join(",")
    });

    if (rooms.has(roomCode)) {
        const queue = await getUpdatedQueue(roomCode);
        broadcastQueueUpdate(roomCode, queue);
    }
}


export async function getUpdatedQueue(roomCode: string) {
    const queueKey = `queue:${roomCode}`;
    const songIds = await redisClient.lRange(queueKey, 0, -1);

    const queue = await Promise.all(
        songIds.map(async (songId) => {
            const songData = await redisClient.hGetAll(`queue:${roomCode}:${songId}`);
            return {
                id: songId,
                title: songData.title || "Unknown Title",
                channel: songData.channel || "Unknown Channel",
                thumbnail: songData.thumbnail || null,
                upvotes: songData.upvotes ? Number(songData.upvotes) : 0, 
            };
        })
    );
    queue.sort((a, b) => b.upvotes - a.upvotes);
    return queue;

}

export {joinRoom, LeaveRoom, searchSong, addToQueue, upvoteSong}