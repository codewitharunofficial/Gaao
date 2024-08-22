import { createContext, useContext, useState } from "react";

const EfxControls = createContext();

const EfxContext = ({children}) => {

    const [currentEfx, setCurrentEfx] = useState("");
    const [appliedEfx, setAppliedEfx] = useState("");

    return (

    <EfxControls.Provider value={{currentEfx, setCurrentEfx, appliedEfx, setAppliedEfx}} >
      {children}
    </EfxControls.Provider>
    )


}

export {EfxControls, EfxContext};