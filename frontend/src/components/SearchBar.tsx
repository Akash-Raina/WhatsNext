import { useState } from "react"

const SearchNavbar = ()=>{

    const [songName, setSongName] = useState('');
    console.log("song", songName);
    return <div className="">
        <input type="text" onChange={(e)=>setSongName(e.target.value)} />
    </div>
}

export default SearchNavbar