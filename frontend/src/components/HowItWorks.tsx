import { Button } from "./Button";


const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Create or Join a Room",
      description: "Start your own music room or join an existing one with a simple code or link shared by a friend.",
      bgColor: "bg-purple-100",
      textColor: "text-purple-500"
    },
    {
      number: "2",
      title: "Add Your Songs",
      description: "Search for your favorite tracks and add them to the queue. Everyone in the room can contribute songs.",
      bgColor: "bg-blue-100",
      textColor: "text-blue-500"
    },
    {
      number: "3",
      title: "Vote and Enjoy",
      description: "Upvote songs you want to hear next. The track with the most votes automatically plays when the current one ends.",
      bgColor: "bg-pink-100",
      textColor: "text-pink-500"
    }
  ];

  return (
    <div className="w-full py-20 px-4 md:px-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-purple-500">What's Next</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple 3-step process to get your collaborative playlist up and running
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <div className={`${step.bgColor} ${step.textColor} rounded-full w-24 h-24 flex items-center justify-center mb-6 text-3xl font-bold`}>
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            Ready to start your collaborative playlist?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button value="Back to Top" onclick={() => {window.scrollTo({ top: 0, behavior: "smooth" });}}
  classname="bg-purple-600 hover:bg-purple-700 text-white border-none font-semibold px-6 py-4 text-lg rounded-2xl cursor-pointer"
/>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;