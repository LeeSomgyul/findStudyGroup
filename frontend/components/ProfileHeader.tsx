import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../app/authContext";

const ProfileHeader: React.FC = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const { isLoggedIn, profileImage } = auth;

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("profileImage");
            await AsyncStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];

            // 상태 초기화
            setAuth({
                isLoggedIn: false,
                userId: null,
                profileImage: "",
                token: null,
            });

            Alert.alert("로그아웃 완료", "홈 화면으로 이동합니다.");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <View>
            {isLoggedIn ? (
                <View>
                    <Image source={{ uri: `http://localhost:8080${profileImage}` }} />
                    <TouchableOpacity onPress={handleLogout}>
                        <Text>로그아웃</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <TouchableOpacity>
                        <Text>로그인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>회원가입</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ProfileHeader;
