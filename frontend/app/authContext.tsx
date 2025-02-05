import React, { createContext, useState } from "react";

interface AuthState {
    isLoggedIn: boolean;
    userId: number | null;
    profileImage: string;
    token: string | null;
}

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
    setAuth: () => {}, // 빈 함수
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        isLoggedIn: false,
        userId: null,
        profileImage: "",
        token: null,
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;