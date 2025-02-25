import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import MainStack from "@/navigation/MainStack";
import AuthStack from "@/navigation/AuthStack";
import ProfileHeader from "@/components/ProfileHeader";

interface RouterProps {
    isLoggedIn: boolean;
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ 전체 네비게이션 설정
const Router: React.FC<RouterProps> = ({ isLoggedIn }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
                <Stack.Screen name="MainStack" component={MainStack} />   // ✅ 로그인 시 MainStack!
            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} />   // ❌ 로그아웃 시 AuthStack!
            )}
        </Stack.Navigator>
    );
};

export default Router;