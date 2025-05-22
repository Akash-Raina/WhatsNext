import { useState } from "react";
import { MdWarningAmber } from "react-icons/md";

const ApiLimitWarning = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="relative">
      <MdWarningAmber
        size={22}
        className="text-amber-500 cursor-pointer hover:text-amber-600 transition-colors"
        onClick={() => setShowPopup(true)}
        title="YouTube API Notice"
      />

      {showPopup && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-100 border border-amber-400 text-gray-800 text-sm p-4 rounded-lg shadow-lg z-50">
          <p className="mb-2 font-medium">Heads up!</p>
          <p>
            If you're getting <strong>"No results found"</strong> while searching for songs, it's likely because we've temporarily hit the request limit for the YouTube API.
          </p>
          <p className="mb-2 text-[13px] text-gray-700 mt-2">
            <strong>Note for Admins:</strong> If you're joining to control playback, please use a desktop or laptop.
            YouTube API may not function properly on mobile browsers. Users can join from any device.
          </p>
          <button
            className="mt-3 px-3 py-1 text-sm cursor-pointer
             bg-amber-600 hover:bg-amber-700 text-white rounded"
            onClick={() => setShowPopup(false)}
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiLimitWarning;
