import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "@/screens/Home";
import DailyCalendarScreen from "@/screens/DailyCalendar";
import LoginScreen from "@/screens/Login";
import JoinScreen from "@/screens/Join";
import ProfileHeader from "../components/ProfileHeader";
import { AuthContext } from "./authContext";
import { useContext } from "react";

// ✅ Bottom Tab Navigator 생성
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ 하단 탭 네비게이션 설정
function BottomTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{
            headerTitle: () => <ProfileHeader />,
            headerStyle: { backgroundColor: "#fff" },
        }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="DailyCalendar" component={DailyCalendarScreen} />
        </Tab.Navigator>
    );
}

// ✅ 전체 네비게이션 설정
export default function Router() {
    const { auth } = useContext(AuthContext);

    return (
            <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
                {/* 메인 화면 (BottomTabNavigator 포함) */}
                <Stack.Screen name="Main" component={BottomTabNavigator} />

                {/* Navbar 없는 페이지 (로그인, 회원가입) */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Join" component={JoinScreen} />
            </Stack.Navigator>
    );
}
