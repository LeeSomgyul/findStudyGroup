import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./Router";
import { AuthProvider } from "./authContext";

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Router />
            </NavigationContainer>
        </AuthProvider>
    );
}