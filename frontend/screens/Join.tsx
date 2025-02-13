import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import globalStyles from "../styles/ globalStyles";
import goalList from "@/components/GoalList";
import {checkEmailApi, checkNicknameApi} from "@/constants/api";

// ✅ 네비게이션 스택 타입 정의
type RootStackParamList = {
    Login: undefined;
    // 필요한 다른 스크린이 있다면 추가 가능
};

const JoinForm: React.FC = () => {
    //input 상태
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);

    //중복검사 상태
    const [isEmailCheck, setIsEmailCheck] = useState(false);
    const [isNicknameCheck, setIsNicknameCheck] = useState(false);

    //메시지 상태
    const [emailError, setEmailError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [nameError, setNameError] = useState("");
    const [birthDateError, setBirthDateError] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [nicknameSuccess, setNicknameSuccess] = useState("");
    const [profileImageError, setProfileImageError] = useState("");


    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    /*유효성 검사 규칙*/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//이메일 형식
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/; //5자 이상 + 특수문자, 숫자, 영문자 포함
    const phoneRegex = /^\d{11}$/; // 11자리 숫자만 가능
    const nameRegex = /^[가-힣a-zA-Z]+$/; // 한글, 영어만 가능
    const birthDateRegex = /^\d{8}$/; // 숫자 8자리만 가능
    const nicknameRegex = /^[가-힣a-zA-Z]{2,7}$/; // 한글 및 영문자 2~7글자

    /*유효성검사 함수*/
    const validateInputs = () => {
        let valid = false;

        if(!email.trim() || !emailRegex.test(email)){
            setEmailError("이메일 형식으로 입력해주세요.");
            setEmailSuccess("");
            valid = false;
        }

        if(!password.trim() || !passwordRegex.test(password)){
            setPasswordError("5자 이상, 영문자, 숫자, 특수문자를 포함해야 합니다.");
            valid = false;
        }

        if(!confirmPassword.trim() || password !== confirmPassword){
            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
            valid = false;
        }

        if(!phone.trim() || !phoneRegex.test(phone)){
            setPhoneError("11자리 숫자로 입력해주세요.");
            valid = false;
        }

        if (!name.trim() || !nameRegex.test(name)) {
            setNameError("이름은 한글 또는 영어만 입력 가능합니다.");
            valid = false;
        }

        if (!birthDate.trim() || !birthDateRegex.test(birthDate)) {
            setBirthDateError("8자리 숫자로 입력해주세요.");
            valid = false;
        }

        if (!nickname.trim() || !nicknameRegex.test(nickname)) {
            setNicknameError("한글 또는 영문자 2~7자만 입력 가능합니다.");
            setNicknameSuccess("");
            valid = false;
        }

        if (profileImage && profileImage.size > 5 * 1024 * 1024) {
            setProfileImageError("프로필 사진은 5MB 이하만 가능합니다.");
            valid = false;
        }

        return valid;
    }

    /* 아이디(이메일) 중복확인 버튼 */
    const handleEmailCheck = async () => {
        if (!email.trim()) {
            setEmailError("아이디(이메일)를 입력해주세요.")
            setEmailSuccess("");
            return;
        }

        if(!emailRegex.test(email)){
            setEmailError("이메일 형식으로 입력해주세요.");
            setEmailSuccess("");
            return;
        }

        try {
            const response = await checkEmailApi(email);
            setEmailError("");
            setEmailSuccess(response.data);
            setIsEmailCheck(true);
        } catch (error: any) {
            console.log("아이디 중복검사 에러 발생:", error.response?.data || error.message);
            setEmailError("중복확인 중 오류가 발생하였습니다.");
            setEmailSuccess("");
            setIsEmailCheck(false);
        }
    };

    /*닉네임 중복확인 버튼*/
    const handleNicknameCheck = async () => {
        if(!nickname.trim()){
            setNicknameError("닉네임을 입력해주세요.");
            setNicknameSuccess("");
            return;
        }

        if(!nicknameRegex.test(nickname)){
            setNicknameError("한글 또는 영문자 2~7자만 입력 가능합니다.");
            setNicknameSuccess("");
            return;
        }

        try{
            const response = await checkNicknameApi(nickname);
            setNicknameError("");
            setNicknameSuccess(response.data);
            setIsNicknameCheck(true);
        }catch (error:any){
            console.log("이메일 중복검사 에러 발생: ", error.response?.data || error.message);
            setNicknameError("중복확인 중 오류가 발생하였습니다.");
            setNicknameSuccess("");
            setIsNicknameCheck(false);
        }
    }

    /* 가입하기 버튼 */
    const handleSubmit = async () => {
        setEmailError(""); setPasswordError(""); setConfirmPasswordError("");
        setPhoneError(""); setNameError(""); setBirthDateError("");
        setNicknameError(""); setProfileImageError("");

        if(!validateInputs()){
            return;
        }

        if (!isEmailCheck) {
            setEmailError("아이디(이메일) 중복확인 검사를 해주세요.");
            setEmailSuccess("");
            return;
        }

        if(!isNicknameCheck){
            setNicknameError("닉네임 중복확인 검사를 해주세요.");
            setNicknameSuccess("");
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
            <TextInput
                placeholder="이메일"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                    setEmailSuccess("");
                }}
                style={globalStyles.input}
            />
            {emailError ? <Text>{emailError}</Text> : null}
            {emailSuccess ? <Text>{emailSuccess}</Text> : null}
            <TouchableOpacity onPress={handleEmailCheck} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>중복확인</Text>
            </TouchableOpacity>
            <TextInput placeholder="비밀번호" value={password} secureTextEntry onChangeText={setPassword} style={globalStyles.input}/>
            {passwordError ? <Text>{passwordError}</Text> : null}
            <TextInput placeholder="비밀번호 확인" value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} style={globalStyles.input}/>
            {confirmPasswordError ? <Text>{confirmPasswordError}</Text> : null}
            <TextInput placeholder="휴대폰" value={phone} onChangeText={setPhone} style={globalStyles.input}/>
            {phoneError ? <Text>{phoneError}</Text> : null}
            <TextInput placeholder="이름(실명)" value={name} onChangeText={setName} style={globalStyles.input}/>
            {nameError ? <Text>{nameError}</Text> : null}
            <TextInput placeholder="생년월일(8자리)" value={birthDate} onChangeText={setBirthDate} style={globalStyles.input}/>
            {birthDateError ? <Text>{birthDateError}</Text> : null}
            <TextInput placeholder="닉네임" value={nickname} onChangeText={setNickname} style={globalStyles.input}/>
            {nicknameError ? <Text>{nicknameError}</Text> : null}
            {nicknameSuccess ? <Text>{nicknameSuccess}</Text> : null}
            <TouchableOpacity onPress={handleNicknameCheck} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>중복확인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>가입하기</Text>
            </TouchableOpacity>
        </View>
    );
};

export default JoinForm;