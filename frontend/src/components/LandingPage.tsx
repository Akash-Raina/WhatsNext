import MainSection from "./MainSection"
import Navbar from "./Navbar"

const LandingPage = ()=>{
    return <div className="flex flex-col h-screen w-screen">
        <Navbar/>
        <MainSection/>
    </div>
}

export default LandingPage