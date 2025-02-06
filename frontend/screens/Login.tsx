import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthContext } from "../app/authContext";
import globalStyles from "../styles/ globalStyles";
import {loginUserApi} from "../constants/api";

// ✅ 네비게이션 타입 정의
type RootStackParamList = {
    Main: undefined;
};

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormessage, setErrormessage] = useState("");

    const { setAuth } = useContext(AuthContext);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleLogin = async () => {
        if (!email) {
            Alert.alert("아이디(이메일)를 입력해주세요.");
            return;
        }

        if (!password) {
            Alert.alert("비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await loginUserApi(email, password);
            const { id, token, profileImage } = response.data;

            await AsyncStorage.setItem("userId", id.toString());
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("profileImage", profileImage);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // 로그인 상태 업데이트
            setAuth({
                isLoggedIn: true,
                userId: id,
                profileImage,
                token,
            });

            setErrormessage("");
            Alert.alert("로그인 성공", "홈 화면으로 이동합니다.");
            navigation.navigate("Main");
        } catch (error: any) {
            setErrormessage("아이디(이메일) 또는 비밀번호가 틀렸습니다.");
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>로그인</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="비밀번호"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            {errormessage ? <Text>{errormessage}</Text> : null}
            <TouchableOpacity onPress={handleLogin} style={globalStyles.button}>
                <Text  style={globalStyles.buttonText}>로그인</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;