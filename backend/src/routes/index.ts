import express from "express";
import { createRoomApi, joinRoomApi } from "../controller/user.controller";

const router = express.Router();

router.post('/create-room', createRoomApi);
router.post('/join-room', joinRoomApi);

export default router;