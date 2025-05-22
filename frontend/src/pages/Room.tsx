import axios from "axios";
import { Button } from "../components/Button";
import MusicPlayer from "../components/MusicPlayer";
import RoomNavbar from "../components/RoomNavbar";
import SongsQueue from "../components/SongsQueue";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/WhoJoinedContext";

const Room = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const uid = localStorage.getItem("uid");
  const leaveRoom = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/leave-room`,{
        data: { roomCode },
        headers: {
          'x-uid': uid,
        },
      });
      if (response) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };
    const deleteRoom = async () => {
      try{ 
        const response = await axios.delete(`${BASE_URL}/delete-room`,{
          data: { roomCode },
          headers: {
            'x-uid': uid,
          },
        });
        if (response) {
          navigate("/");
        }
      }
      catch (error) {
        console.error("Error deleting room:", error);
      }
  };

  return (
    <div className="min-h-screen bg-[#f6f3ff] overflow-x-hidden">
      <div className="flex flex-col max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Navbar */}
        <RoomNavbar />

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Songs Queue */}
          <div className="flex-1">
            <SongsQueue />
          </div>

          {/* Music Player for Admin */}
          {user === "Admin" && (
            <div className="w-full lg:w-[350px] sticky top-4 self-start">
              <MusicPlayer />
            </div>
          )}
        </div>

        {/* Leave/Delete Button */}
        <div className="flex justify-end">
          <Button
            value={user === "Admin" ? "Delete Room" : "Leave Room"}
            onclick={user === "Admin" ? deleteRoom : leaveRoom}
          />
        </div>
      </div>
    </div>
  );
};

export default Room;
