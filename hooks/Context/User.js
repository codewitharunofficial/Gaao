import { createContext, useContext, useState } from "react";

const Auth = createContext();

const UserContext = ({children}) => {

    const [user, setUser] = useState({});

    return (

    <Auth.Provider value={{user, setUser}} >
      {children}
    </Auth.Provider>
    )


}

export {Auth, UserContext};