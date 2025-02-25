import React, {useContext} from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./Router";
import {AuthContext, AuthProvider} from "./authContext";

export default function App() {

    return (
        <AuthProvider>
            <MainApp/>
        </AuthProvider>
    );
}

const MainApp = () => {
    const {auth} = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Router isLoggedIn={auth.isLoggedIn} />
        </NavigationContainer>
    );
}