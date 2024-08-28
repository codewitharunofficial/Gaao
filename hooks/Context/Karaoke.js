import { createContext, useContext, useState } from "react";

const TrackControls = createContext();

const KaraokeContext = ({children}) => {

    const [currentSound, setCurrentSound] = useState(null);
    const [position, setPosition] = useState(0);

    return (

    <TrackControls.Provider value={{currentSound, setCurrentSound, position, setPosition}} >
      {children}
    </TrackControls.Provider>
    )


}

export {TrackControls, KaraokeContext};