//⭐ 로그인 후 화면들을 관리
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import HomeScreen from "@/screens/Home";
import DailyCalendarScreen from "@/screens/DailyCalendar";


const Tab = createBottomTabNavigator();

const MainStack = () => {
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="DailyCalendar" component={DailyCalendarScreen}/>
        </Tab.Navigator>
    );
};

export default MainStack;