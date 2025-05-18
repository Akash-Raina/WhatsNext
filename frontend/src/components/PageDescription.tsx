import { CiMusicNote1 } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import { FiUsers, FiClock } from "react-icons/fi";


const PageDescription = () => {
  const features = [
    {
      icon: <CiMusicNote1 className="w-6 h-6 text-white"/>,
      title: "Queue Your Tracks",
      description: "Add songs from Spotify, Apple Music, or YouTube. Everyone can contribute to the playlist.",
    },
    {
      icon: <AiOutlineLike className="w-6 h-6 text-white"/>,
      title: "Democratic Voting",
      description: "The most popular songs rise to the top. Every vote counts in deciding what plays next.",
    },
    {
      icon: <FiUsers className="w-6 h-6 text-white"/>,
      title: "Private Rooms",
      description: "Create rooms for different events and invite specific friends with a simple link or code.",
    },
    {
      icon: <FiClock className="w-6 h-6 text-white"/>,
      title: "Real-time Updates",
      description: "Watch the queue change instantly as people vote and add new songs to the playlist.",
    },
  ];

  return (
    <div className="w-full py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            A Platform Built for <span className="text-purple-500">Music Lovers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Where everyone has a say in what plays next
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageDescription;
