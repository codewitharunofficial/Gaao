import { createContext, useContext, useState } from "react";

const WelcomeContext = createContext();

const WelcomeScreenProvider = () => {

    const [hide, setHide] = useState(false);

    <WelcomeContext.Provider value={[hide, setHide]} >
      {children}
    </WelcomeContext.Provider>

}

const useGreetings = useContext(WelcomeContext);

export {useGreetings, WelcomeScreenProvider};