import React, {createContext, useEffect, useState} from 'react';
import {Outlet} from "react-router-dom";

import Navbar from "./Components/Navbar";

/*로그인 상태 여부*/
//인터페이스: 인증 데이터 타입 정의
interface AuthState {
    isLoggedIn: boolean;
    profileImage: string;
    token: string | null;
}

// 초기값 정의
export const AuthContext = createContext<{
    auth: AuthState;
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}>({
    auth: {
        isLoggedIn: false,
        profileImage: "",
        token: null,
    },
    setAuth: () => {}, // 빈 함수
});


function App(){
    const [auth, setAuth] = useState<AuthState>({
        isLoggedIn: false,
        profileImage: "",
        token: null,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token){
          setAuth({
              isLoggedIn: true,
              profileImage: "",
              token,
          });
        }
    },[]);

    return(
        <AuthContext.Provider value={{auth, setAuth}}>
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