import { createContext, ReactNode, useContext, useState } from "react"

interface Song {
    id: string;
    title: string;
    thumbnail: string | null;
    channel: string;
    upvotes: number;
    upvotedBy: string;
}

interface SongsListContextType{
    songs: Song[]
    setSongs: (song: Song[]) => void
}

const SongsListContext = createContext<SongsListContextType | null>(null);

export const SongsListProvider = ({children} : {children: ReactNode})=>{

    const [songs, setSongs] = useState<Song[]>([]);

    return <SongsListContext.Provider value={{songs, setSongs}}>
        {children}
    </SongsListContext.Provider>
}

export const useSongs = ():SongsListContextType=>{
    const context = useContext(SongsListContext);

    if(!context) throw new Error('getSongs must be used within a SongsListProvider');
    return context;
}