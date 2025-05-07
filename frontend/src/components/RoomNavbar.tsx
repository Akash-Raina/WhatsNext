import SearchNavbar from "./SearchBar"

const RoomNavbar = ()=>{

    return <div className="flex justify-between items-center p-5 border">
        <div className="flex gap-2 items-center">
            <span className="rounded-full h-5 w-5 bg-red-600"></span>
            <span>10</span>
        </div>
        <SearchNavbar/>
        <div>
            Room Code: FLAS82SK
        </div>
    </div>
}

export default RoomNavbar