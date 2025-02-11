import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import globalStyles from "../styles/ globalStyles";
import goalList from "@/components/GoalList";
import {checkEmailApi} from "@/constants/api";

// ✅ 네비게이션 스택 타입 정의
type RootStackParamList = {
    Login: undefined;
    // 필요한 다른 스크린이 있다면 추가 가능
};

const JoinForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isEmailCheck, setIsEmailCheck] = useState(false);
    const [isNicknameCheck, setIsNicknameCheck] = useState(false);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    /* 아이디(이메일) 중복확인 버튼 */
    const handleEmailCheck = async () => {
        if (!email) {
            Alert.alert("이메일을 입력해주세요.");
            return;
        }
        try {
            const response = await checkEmailApi(email);
            Alert.alert(response.data);
            setIsEmailCheck(true);
        } catch (error: any) {
            console.log("에러 발생:", error.response?.data || error.message);
            Alert.alert("중복 확인 중 오류가 발생하였습니다.");
            setIsEmailCheck(false);
        }
    };

    /* 가입하기 버튼 */
    const handleSubmit = async () => {
        if (!email || !password || !confirmPassword || !phone || !name || !birthDate || !nickname) {
            Alert.alert("모든 필드를 입력해주세요.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!isEmailCheck || !isNicknameCheck) {
            Alert.alert("아이디(이메일) 또는 닉네임 중복확인을 해주세요.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("data", new Blob([JSON.stringify({
                email, password, phone, name, birthDate, nickname,
            })], { type: "application/json" }));
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const response = await axios.post("/api/user/userRegister", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                Alert.alert("회원가입이 완료되었습니다.");
                navigation.navigate("Login");
            } else {
                Alert.alert("회원가입 요청이 정상적으로 처리되지 않았습니다.");
            }
        } catch (error) {
            Alert.alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>회원가입</Text>
            <TextInput placeholder="이메일" value={email} onChangeText={setEmail} style={globalStyles.input}/>
            <TouchableOpacity onPress={handleEmailCheck} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>중복확인</Text>
            </TouchableOpacity>
            <TextInput placeholder="비밀번호" value={password} secureTextEntry onChangeText={setPassword} style={globalStyles.input}/>
            <TextInput placeholder="비밀번호 확인" value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} style={globalStyles.input}/>
            <TextInput placeholder="휴대폰" value={phone} onChangeText={setPhone} style={globalStyles.input}/>
            <TextInput placeholder="이름(실명)" value={name} onChangeText={setName} style={globalStyles.input}/>
            <TextInput placeholder="생년월일(8자리)" value={birthDate} onChangeText={setBirthDate} style={globalStyles.input}/>
            <TextInput placeholder="닉네임" value={nickname} onChangeText={setNickname} style={globalStyles.input}/>
            <TouchableOpacity onPress={handleSubmit} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>가입하기</Text>
            </TouchableOpacity>
        </View>
    );
};

export default JoinForm;