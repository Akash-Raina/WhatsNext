import axios from "axios"
import { Button } from "../components/Button"
// import MusicPlayer from "../components/MusicPlayer"
import RoomNavbar from "../components/RoomNavbar"
import SongsQueue from "../components/SongsQueue"
import { useNavigate, useParams } from "react-router-dom"
import { useUser } from "../context/WhoJoinedContext"

const Room = ()=>{
    console.log('room page got called')
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const {roomCode} = useParams();
    const navigate = useNavigate();
    const {user} = useUser();
    const leaveRoom = async()=>{
        const response = await axios.delete(`${BASE_URL}/leave-room`,{data : {roomCode: roomCode}})
        if(response){
            navigate('/')
        }
    }

    return <div className="h-screen">
        <RoomNavbar/>
        <div className="flex flex-col justify-around items-center h-[75%]">
            <div className="flex justify-around items-center h-full w-screen">
                <SongsQueue/>
                {/* <MusicPlayer videoId="XTp5jaRU3Ws"/> */}
            </div>
            {user === 'Admin' ? <Button value="Delete" onclick={leaveRoom}/> : <Button value="Leave" onclick={leaveRoom}/>}
        </div>
    </div>
}

export default Room