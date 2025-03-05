import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../app/authContext";
import globalStyles from "../styles/ globalStyles";
import {loginUserApi} from "../constants/userApi";
import {AuthStackType} from "@/navigation/AuthStack";


const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormessage, setErrormessage] = useState("");

    const { setAuth } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackType>>();

    //✅ 로그인 버튼 클릭 시
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
            //1️⃣ 백엔드로 아이디, 비밀번호 전송
            const response = await loginUserApi(email, password);

            //2️⃣ 아이디, 비밀번호에 맞는 사용자 정보 응답받음
            const { id, token, profileImage } = response.data;

            //3️⃣ AsyncStorage에 정보 저장(새로고침 해도 유지)
            await AsyncStorage.setItem("userId", id.toString());
            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("profileImage", profileImage);


            //4️⃣ 기본 토근으로 설정하여 api접근 시 사용자가 누군지 알 수 있음
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            //5️⃣ 로그인 상태 업데이트
            setAuth({
                isLoggedIn: true,
                userId: id,
                profileImage,
                token,
            });
            setErrormessage("");
            //6️⃣ home으로 이동은 <Router.tsx>에서 작성함
        } catch {
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
            <TouchableOpacity onPress={() => navigation.navigate("Join")}>
                <Text>회원가입</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;