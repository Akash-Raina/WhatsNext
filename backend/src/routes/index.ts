import express from "express";
import { addToQueueApi, LeaveRoomApi, joinRoomApi, searchSongApi } from "../controller/user.controller";
import { extractRoomCode, userAuth, validateUserFingerprint } from "../middlewares/userMiddleware";
import { createRoomApi, deleteRoomApi } from "../controller/admin.controller";


const router = express.Router();

router.post('/create-room', createRoomApi);
router.delete('/delete-room', deleteRoomApi)
router.delete('/leave-room',extractRoomCode, validateUserFingerprint, LeaveRoomApi);
router.post('/join-room',extractRoomCode, validateUserFingerprint, joinRoomApi);
router.post('/search', searchSongApi);
router.post('/add-to-queue', userAuth,  addToQueueApi)

export default router;