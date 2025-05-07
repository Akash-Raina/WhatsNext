import { useState, useEffect, ChangeEvent, useMemo } from "react";
import debounce from "lodash/debounce";
import axios from "axios";
import { IoIosAddCircle } from "react-icons/io";
import { useParams } from "react-router-dom";

interface SongResult {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SearchNavbar = () => {
  const [songName, setSongName] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SongResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {roomCode} = useParams()

  const searchSongs = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        try {
          setIsLoading(true);
          const response = await axios.post(
            `${BACKEND_URL}/search`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
              },
              params: { query },
            }
          );

          const data = response.data.data;
          setSearchResults(data || []);
        } catch (error) {
          console.error("Error searching songs:", error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      searchSongs.cancel();
    };
  }, [searchSongs]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSongName(value);
    searchSongs(value);
  };


  const addToQueue = async(result:SongResult)=>{
    if(result){
      await axios.post(`${BACKEND_URL}/add-to-queue`, {roomCode, song: result})
    }
    setSongName("");
    setSearchResults([]);
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative">
        <input
          type="text"
          value={songName}
          onChange={handleInputChange}
          placeholder="Search songs..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex items-center gap-4"
            >
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="text-gray-800 font-medium">{result.title}</p>
                <p className="text-gray-600 text-sm">{result.channel}</p>
              </div>
              <IoIosAddCircle size={28} className="mb-2 ml-5" onClick={()=>addToQueue(result)}/>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchNavbar;