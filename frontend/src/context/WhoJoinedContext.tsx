import { createContext, ReactNode, useContext, useState } from "react";

interface WhoJoinedContextType{
    user: string
    setUser: (user: string)=> void
}
const WhoJoinedContext = createContext<WhoJoinedContextType | null>(null);

export const WhoJoinedProvider = ({children}: {children: ReactNode})=>{
    const [user, setUser] = useState('');

    return <WhoJoinedContext.Provider value={{user, setUser}}>{children}</WhoJoinedContext.Provider>
}

export const useUser = ():WhoJoinedContextType=>{
    const context = useContext(WhoJoinedContext);
    if(!context) throw new Error('getUser must be used within a WhoJoinedProvider');
    return context;
}