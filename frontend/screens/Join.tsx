import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {View, Text, TextInput, TouchableOpacity, Alert, Image, Platform} from "react-native";
import * as ImagePicker from "expo-image-picker";
import globalStyles from "../styles/ globalStyles";
import {checkEmailApi, checkNicknameApi, joinApi} from "@/constants/userApi";


// ✅ 네비게이션 스택 타입 정의
type RootStackParamList = {
    Login: undefined;
    // 필요한 다른 스크린이 있다면 추가 가능
};

// ✅ 프로필 이미지 타입 정의
type ImageFile = {
    uri: string;
    name: string;
    type: string;
    size?: number;
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
    const [profileImage, setProfileImage] = useState<ImageFile | null>(null);
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);//프로필 미리보기 이미지
    const profileImageRef = useRef<string | null>(null);//useRef로 새로고침 시 초기화 방지

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


    /*✅ 유효성검사 함수*/
    const validateInputs = () => {
        let valid = true;

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

        if (profileImage && profileImage.size && profileImage.size > 5 * 1024 * 1024) {
            setProfileImageError("프로필 사진은 5MB 이하만 가능합니다.");
            valid = false;
        }

        return valid;
    }

    //기본 프로필 이미지
    const DEFAULT_PROFILE_IMAGE = require("../assets/images/default_profile.jpg");


    /*✅ 프로필 이미지 함수*/
    const pickImage = async () => {
        //1️⃣ 갤러리 접근 권한 요청
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
            Alert.alert("권한 필요", "프로필 사진을 등록하려면 갤러리 접근 권한이 필요합니다.");
            return;
        }

        //2️⃣ 사용자가 갤러리에서 이미지 선택
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,//이미지 편집 기능 활성화
            aspect: [1, 1],//1:1 비율로 자르기
            quality: 1,//이미지 품질(1=최상)
            base64: false,//base64대신 파일 경로로 처리
        });

        //3️⃣ 이미지 선택이 완료된 후
        if (!result.canceled && result.assets?.length > 0) {
            const selectedImage = result.assets[0];

            //4️⃣ 웹과 모바일에 따라 이미지 처리 다르게 하기
            const imageFile: ImageFile = {
                uri: Platform.OS === "web"
                    ? URL.createObjectURL(await (await fetch(selectedImage.uri)).blob())// 웹: Blob으로 변환
                    : selectedImage.uri, // 모바일: 경로 그대로 사용
                name: `profile_${Date.now()}.jpg`,
                type: selectedImage.mimeType || "image/jpeg",
                size: selectedImage.fileSize ?? 0,
            };

            //5️⃣ 상태 저장
            setProfileImage(imageFile);
            setProfileImageUri(selectedImage.uri);
        }

    };

    /*✅ 아이디(이메일) 중복확인 버튼 */
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
            setEmailError(error.response?.data);
            setEmailSuccess("");
            setIsEmailCheck(false);
        }
    };

    /*✅ 닉네임 중복확인 버튼*/
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
            setNicknameError(error.response?.data);
            setNicknameSuccess("");
            setIsNicknameCheck(false);
        }
    }

    /*✅ 가입하기 버튼 */
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

        const userData = {email, password, phone, name, birthDate, nickname};

        try {
            const response = await joinApi(userData, profileImage);

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
                    setIsEmailCheck(false);
                }}
                style={globalStyles.input}
            />
            {emailError ? <Text>{emailError}</Text> : null}
            {emailSuccess ? <Text>{emailSuccess}</Text> : null}
            <TouchableOpacity onPress={handleEmailCheck} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>중복확인</Text>
            </TouchableOpacity>
            <TextInput
                placeholder="비밀번호"
                value={password}
                secureTextEntry
                onChangeText={(text)=> {setPassword(text); setPasswordError("");}}
                style={globalStyles.input}
            />
            {passwordError ? <Text>{passwordError}</Text> : null}
            <TextInput
                placeholder="비밀번호 확인"
                value={confirmPassword}
                secureTextEntry
                onChangeText={(text) => {setConfirmPassword(text); setConfirmPasswordError("");}}
                style={globalStyles.input}
            />
            {confirmPasswordError ? <Text>{confirmPasswordError}</Text> : null}
            <TextInput
                placeholder="휴대폰"
                value={phone}
                onChangeText={(text) => {setPhone(text); setPhoneError("");}}
                style={globalStyles.input}
            />
            {phoneError ? <Text>{phoneError}</Text> : null}
            <TextInput
                placeholder="이름(실명)"
                value={name}
                onChangeText={(text) => {setName(text); setNameError("");}}
                style={globalStyles.input}
            />
            {nameError ? <Text>{nameError}</Text> : null}
            <TextInput
                placeholder="생년월일(8자리)"
                value={birthDate}
                onChangeText={(text) => {setBirthDate(text); setBirthDateError("");}}
                style={globalStyles.input}
            />
            {birthDateError ? <Text>{birthDateError}</Text> : null}
            <TextInput
                placeholder="닉네임"
                value={nickname}
                onChangeText={(text) => {setNickname(text); setNicknameError(""); setIsNicknameCheck(false);}}
                style={globalStyles.input}
            />
            {nicknameError ? <Text>{nicknameError}</Text> : null}
            {nicknameSuccess ? <Text>{nicknameSuccess}</Text> : null}
            <TouchableOpacity onPress={handleNicknameCheck} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>중복확인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
                <Text>프로필 이미지 선택</Text>
            </TouchableOpacity>
            <Image
                source={profileImageUri ? {uri: profileImageUri} : profileImageRef.current ? {uri: profileImageRef.current} : DEFAULT_PROFILE_IMAGE}
                style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }}
            />
            {profileImageError ? <Text>{profileImageError}</Text> : null}
            <TouchableOpacity onPress={handleSubmit} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>가입하기</Text>
            </TouchableOpacity>
        </View>
    );
};

export default JoinForm;