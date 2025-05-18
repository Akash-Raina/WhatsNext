import { useState, useEffect, ChangeEvent, useMemo, useRef } from "react";
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

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SearchNavbar = ({ visible, onClose }: Props) => {
  const [songName, setSongName] = useState("");
  const [searchResults, setSearchResults] = useState<SongResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { roomCode } = useParams();

  const searchSongs = useMemo(
    () =>
      debounce(async (query: string) => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }
        try {
          setIsLoading(true);
          const response = await axios.post(`${BACKEND_URL}/search`, {}, {
            headers: { "Content-Type": "application/json" },
            params: { query },
          });
          setSearchResults(response.data.data || []);
        } catch (error) {
          console.error("Error searching songs:", error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => () => searchSongs.cancel(), [searchSongs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalVisible(false);
        setSongName("");
        setSearchResults([]);
        onClose?.();
      }
    };
    if (isModalVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalVisible, onClose]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSongName(value);
    setIsModalVisible(true);
    searchSongs(value);
  };

  const addToQueue = async (result: SongResult) => {
    if (result) {
      await axios.post(`${BACKEND_URL}/add-to-queue`, { roomCode, song: result });
    }
    setIsModalVisible(false);
    setSongName("");
    setSearchResults([]);
    onClose?.();
  };

  if (!visible) return null;

return (
  <div className="w-full max-w-2xl mx-auto p-4 relative" ref={modalRef}>
    <input
      type="text"
      value={songName}
      onChange={handleInputChange}
      placeholder="Search for songs..."
      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      autoFocus
    />

    {isModalVisible && (
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[95%] max-h-[70vh] bg-white border border-gray-300 rounded-lg shadow-xl overflow-y-auto z-50"
      >
        {isLoading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div
              key={result.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 flex items-center gap-4"
            >
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium truncate">{result.title}</p>
                <p className="text-gray-600 text-sm truncate">{result.channel}</p>
              </div>
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 ml-auto">
                <IoIosAddCircle
                  size={28}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  onClick={() => addToQueue(result)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No results found.</p>
        )}
      </div>
    )}
  </div>
);
}

export default SearchNavbar;
