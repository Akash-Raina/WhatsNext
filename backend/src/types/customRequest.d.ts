import {Request} from 'express';

export interface CustomRequest extends Request {
    roomCode?: string;
    userFingerPrintId?: string;
}

export interface Song {
    id: string;
    title: string;
    thumbnail: string | null;
    channel: string;
    upvotes: number;
    upvotedBy: string;
  }
  