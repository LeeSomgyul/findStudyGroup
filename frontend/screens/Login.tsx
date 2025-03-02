import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../app/authContext";
import globalStyles from "../styles/ globalStyles";
import {loginUserApi} from "../constants/userApi";


const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormessage, setErrormessage] = useState("");

    const { setAuth } = useContext(AuthContext);

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
            console.log("📡 백엔드로 로그인 요청 보냄:", email, password); // ✅ 로그 추가
            //1️⃣ 백엔드로 아이디, 비밀번호 전송
            const response = await loginUserApi(email, password);
            console.log("✅ 로그인 성공! 응답 데이터:", response.data); // ✅ 응답 확인

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
        } catch (error: any) {
            console.error("❌ 로그인 실패! 오류 메시지:", error); // ✅ 실패 로그 추가
            if (error.response) {
                console.error("❌ 백엔드 응답 코드:", error.response.status); // ✅ HTTP 응답 코드 확인
                console.error("❌ 백엔드 응답 데이터:", error.response.data); // ✅ 백엔드에서 보낸 오류 메시지 확인
            }
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