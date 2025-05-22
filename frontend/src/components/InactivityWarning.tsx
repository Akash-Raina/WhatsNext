import { useState, useRef, useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";

const InactivityWarning = () => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popupRef}>
      <FaInfoCircle
        size={18}
        className="text-[#8b5cf6] cursor-pointer hover:text-[#6d28d9] transition mt-1"
        onClick={() => setShowPopup((prev) => !prev)}
      />

      {showPopup && (
        <div className="absolute right-0 mt-2 w-80 bg-[#fdfbff] border border-[#d6bbfb] shadow-lg rounded-md p-4 z-50 text-sm text-[#4b5563]">
          <p className="font-semibold text-[#8b5cf6] mb-1">Why the delay?</p>
          <p>
            This app is hosted on a free-tier server. If it hasn't been used in a while,
            the backend takes time to wake up. Expect an initial delay of <strong>up to 50 seconds</strong>.
          </p>
           <p className="mb-2 text-[13px] text-gray-700 mt-2">
            <strong className="text-red-500">Note for Admins:</strong> If you're joining to control playback, please use a desktop or laptop.
            YouTube API may not function properly on mobile browsers. Users can join from any device.
          </p>
        </div>
      )}
    </div>
  );
};

export default InactivityWarning;
