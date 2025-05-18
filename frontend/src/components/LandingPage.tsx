import Hero from "./Hero"
import HowItWorks from "./HowItWorks"
import Navbar from "./Navbar"
import PageDescription from "./PageDescription"

const LandingPage = ()=>{
    return <div className="flex flex-col h-full w-full overflow-x-hidden">
        <Navbar/>
        <Hero/>
        <PageDescription/>
        <HowItWorks/>
    </div>
}

export default LandingPage