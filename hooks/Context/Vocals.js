import { createContext, useContext, useState } from "react";

const VocalControls = createContext();

const VocalContext = ({children}) => {

    const [currentVocals, setCurrentVocals] = useState(null);

    return (

    <VocalControls.Provider value={{currentVocals, setCurrentVocals}} >
      {children}
    </VocalControls.Provider>
    )


}

export {VocalControls, VocalContext};