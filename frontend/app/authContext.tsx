import React, {createContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//✅ 타입 정의
interface AuthState {
    isLoggedIn: boolean;
    userId: number | null;
    profileImage: string;
    token: string | null;
}

//✅ 사용자 인증의 초기 상태 설정
export const AuthContext = createContext<{
    auth: AuthState;
    setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}>({
    auth: {
        isLoggedIn: false,
        userId: null,
        profileImage: "",
        token: null,
    },
    setAuth: () => {},
});

//✅ 로그인 상태를 웹 전체에 제공
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        isLoggedIn: false,
        userId: null,
        profileImage: "",
        token: null,
    });

    //📌 새로고침 해도 사용자 정보가 저장되어있음
    useEffect(() => {
        const loadAuthData = async () => {
            const token = await AsyncStorage.getItem("token");
            const userId = await AsyncStorage.getItem("userId");
            const profileImage = await AsyncStorage.getItem("profileImage");

            if(token && userId){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setAuth({
                   isLoggedIn: true,
                   userId: parseInt(userId, 10),
                   profileImage: profileImage || "",
                   token,
                });
            };
        };

        loadAuthData();
    },[]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;