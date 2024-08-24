import { createContext, useContext, useState } from "react";

const EfxControls = createContext();

const EfxContext = ({children}) => {

    const [currentEfx, setCurrentEfx] = useState("");
    const [appliedEfx, setAppliedEfx] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [efxList, setEfxList] = useState([]);

    return (

    <EfxControls.Provider value={{currentEfx, setCurrentEfx, appliedEfx, setAppliedEfx, efxList, setEfxList, isProcessing, setIsProcessing}} >
      {children}
    </EfxControls.Provider>
    )


}

export {EfxControls, EfxContext};