import {Request} from 'express';

export interface CustomRequest extends Request {
    roomCode?: string;
    userFingerPrintId?: string;
}