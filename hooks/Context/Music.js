import { createContext, useContext, useState } from "react";

const useMusic = createContext();

const MusicProvider = ({children}) => {

    const [currentTrack, setCurrentTrack] = useState(null);

    return (

    <useMusic.Provider value={{currentTrack, setCurrentTrack}} >
      {children}
    </useMusic.Provider>
    )


}

export {useMusic, MusicProvider};