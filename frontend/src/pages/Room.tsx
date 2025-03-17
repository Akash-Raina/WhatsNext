import MusicPlayer from "../components/MusicPlayer"
import RoomNavbar from "../components/RoomNavbar"
import SongsQueue from "../components/SongsQueue"

const Room = ()=>{

    return <div className="h-screen">
        <RoomNavbar/>
        <div className="flex justify-around items-center h-[85%]">
            <SongsQueue/>
            <MusicPlayer/>
        </div>
    </div>
}

export default Room