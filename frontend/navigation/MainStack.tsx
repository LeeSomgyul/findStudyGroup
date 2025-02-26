//⭐ 로그인 후 화면들을 관리
import HomeScreen from "@/screens/Home";
import DailyCalendarScreen from "@/screens/DailyCalendar";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {Alert, Image, Text, TouchableOpacity, View} from "react-native";
import {useContext} from "react";
import {AuthContext} from "@/app/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

//✅ 상단(햄버거 메뉴)
const CustomHeader = ({ navigation }: any) => {
    const {auth, setAuth} = useContext(AuthContext);

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(["userId", "profileImage", "token"]);
        delete axios.defaults.headers.common["Authorization"];
        setAuth({isLoggedIn: false, userId: null, profileImage: "", token: null});
        Alert.alert("로그아웃 완료", "홈 화면으로 이동합니다.");
    };

    const fullProfileImage = auth.profileImage.startsWith("http")
        ? auth.profileImage
        : `${API_BASE_URL.replace('/api', '')}${auth.profileImage}`;

    return(
        <View>
            <Image source={{uri: fullProfileImage}} style={{ width: 50, height: 50, borderRadius: 25 }}/>

            {auth.isLoggedIn && (
                <TouchableOpacity onPress={handleLogout}>
                    <Text>로그아웃</Text>
                </TouchableOpacity>
            )
            }
        </View>
    );
};

//✅ 하단 탭
const TabNavigator = () => {
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="DailyCalendar" component={DailyCalendarScreen}/>
        </Tab.Navigator>
    );
};

//✅ 상단(햄버거메뉴) + 하단 합치기
const MainStack = () => {
  return(
      <Drawer.Navigator
          screenOptions={{headerShown: true}}
          drawerContent={(props) => <CustomHeader {...props}/>}>
          <Drawer.Screen name="Tabs" component={TabNavigator}/>
      </Drawer.Navigator>
  );
};

export default MainStack;