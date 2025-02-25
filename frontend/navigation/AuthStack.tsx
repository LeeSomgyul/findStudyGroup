//⭐ 로그인, 회원가입 화면을 관리
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "@/screens/Login";
import JoinScreen from "@/screens/Join";

const Stack = createStackNavigator();

const AuthStack = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Join" component={JoinScreen}/>
        </Stack.Navigator>
    );
}

export default AuthStack;
