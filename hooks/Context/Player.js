import { createContext, useContext, useState } from "react";

const PlayerControls = createContext();

const PlayerContext = ({children}) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [trackVolume, setTrackVolume] = useState(1);

    return (

    <PlayerControls.Provider value={{isPlaying, setIsPlaying, trackVolume, setTrackVolume}} >
      {children}
    </PlayerControls.Provider>
    )


}

export {PlayerControls, PlayerContext};