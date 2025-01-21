import React, {createContext, useState} from 'react';
import {Outlet} from "react-router-dom";

import Navbar from "./Components/Navbar";

/*로그인 상태 여부*/
export const AuthContext = createContext<{
    isLoggedIn: boolean;
    profileImage: string;
    setAuth: React.Dispatch<React.SetStateAction<{isLoggedIn: boolean; profileImage: string}>>;
}>({
    isLoggedIn: false,
    profileImage: "",
    setAuth: () => {},
});

function App(){
    const [auth, setAuth] = useState({isLoggedIn: false, profileImage: ""});

    return(
        <AuthContext.Provider value={{...auth, setAuth}}>
            <div>
                <Navbar/>
                <div>
                    <Outlet/>
                </div>
            </div>
        </AuthContext.Provider>
    );
}

export default App;