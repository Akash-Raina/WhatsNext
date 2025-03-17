import { useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainSection = ()=>{

    const BASE_URL = import.meta.env.VITE_BACKEND_URL
    const [isModelOpen, setIsModelOpen] = useState(true);
    const [roomCode, setRoomCode] = useState("");
    const [isRoomCode, setIsRoomCode] = useState(false);
    const navigate = useNavigate();

    const createRoom = async ()=>{
        const response = await axios.post(`${BASE_URL}/create-room`);
        setRoomCode(response?.data.roomCode);
        setIsRoomCode(true);
        setIsModelOpen(true);
    }

    const joinRoom = async()=>{
        setRoomCode("");
        setIsRoomCode(false);
        setIsModelOpen(true);
        
    }

    return <div className="flex border h-[90%] w-screen flex-col justify-center items-center">
        <h1 className=" h-36 font-bold text-4xl">
            Basic UI for v1 will update Later
        </h1>
        <div className="flex gap-3">
            <Button value="Create Room" onclick={createRoom}/>
            <Button value="Join Room" onclick={joinRoom}/>
        </div>
        {
            isModelOpen && (
                <div className="fixed inset-0 flex items-center justify-center ">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center transform transition-all scale-100">
                    {isRoomCode ? <input type="text" className="bg-black text-amber-400" value={roomCode} readOnly/> : <input type="text" className="bg-black text-amber-400" value={roomCode} onChange={(e)=>setRoomCode(e.target.value)}/>}
                    <div className="flex gap-3 justify-center mt-4">
                            <Button value="Cancel" onclick={()=>{setIsModelOpen(false)}}/>
                            <Button value="Join" onclick={async()=>{setIsModelOpen(false)
                                const response = await axios.post(`${BASE_URL}/join-room`, {
                                    roomCode
                                });
                                if(response)
                                    navigate(`/${roomCode}`)
                                console.log('response', response.data);
                            }}/>
                    </div>
                    </div>
                </div>
            )
        }
    </div>
}

export default MainSection