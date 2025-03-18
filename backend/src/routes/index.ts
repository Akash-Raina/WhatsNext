import express from "express";
import { addToQueueApi, LeaveRoomApi, joinRoomApi, searchSongApi, upvoteSongApi } from "../controller/user.controller";
import { extractRoomCode, userAuth, validateUserFingerprint } from "../middlewares/userMiddleware";
import { cancelJoiningRoomApi, createRoomApi, deleteRoomApi } from "../controller/admin.controller";


const router = express.Router();

router.post('/create-room',validateUserFingerprint, createRoomApi);
router.delete('/cancel-room', cancelJoiningRoomApi);
router.delete('/delete-room', deleteRoomApi)
router.delete('/leave-room',extractRoomCode, validateUserFingerprint, LeaveRoomApi);
router.post('/join-room',extractRoomCode, validateUserFingerprint, joinRoomApi);
router.post('/search', searchSongApi);
router.post('/add-to-queue', userAuth,  addToQueueApi);
router.put('/upvote-song', upvoteSongApi);

export default router;