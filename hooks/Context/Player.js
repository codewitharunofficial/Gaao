import { createContext, useContext, useState } from "react";

const PlayerControls = createContext();

const PlayerContext = ({children}) => {

    const [isPlaying, setIsPlaying] = useState(false);

    return (

    <PlayerControls.Provider value={{isPlaying, setIsPlaying}} >
      {children}
    </PlayerControls.Provider>
    )


}

export {PlayerControls, PlayerContext};