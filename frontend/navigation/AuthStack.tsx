//⭐ 로그인, 회원가입 화면을 관리
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "@/screens/Login";
import JoinScreen from "@/screens/Join";

//✅ 타입 정의
export type AuthStackType = {
    Login: undefined;
    Join: undefined;
}

const Stack = createStackNavigator<AuthStackType>();

const AuthStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Join" component={JoinScreen}/>
        </Stack.Navigator>
    );
}

export default AuthStack;
