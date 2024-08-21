import { createContext, useContext, useState } from "react";

const Visualizer = createContext();

const VisualizerContext = ({children}) => {

    const [vocalsWave, setVocalsWave] = useState(false);
    const [musicWave, setMusicWave] = useState(false);

    return (

    <Visualizer.Provider value={{vocalsWave, setVocalsWave, musicWave, setMusicWave}} >
      {children}
    </Visualizer.Provider>
    )


}

export {Visualizer, VisualizerContext};