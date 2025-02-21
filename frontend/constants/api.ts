import axios from "axios";
import Constants from 'expo-constants';
import {Platform} from "react-native";

//✅ 타입 정리
type ImageFile = {
  uri: string;
  name: string;
  type: string;
};

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ 로그인
export const loginUserApi = async (email: string, password: string)=>{
    return api.post("/user/login", {email, password});
}

//✅ 회원가입 중복확인(아이디(이메일))
export const checkEmailApi = async (email: string)=>{
    return api.get("/user/checkEmail", {params: {email} });
}

//✅ 회원가입 중복확인(닉네임)
export const checkNicknameApi = async (nickname: string) => {
    return api.get("/user/checkNickname", {params: {nickname} });
}

//✅ 회원가입
export const joinApi = async (userData: any, profileImage?: ImageFile | null)=>{
    const formData = new FormData();//서버에 보낼 데이터들을 담는 가방 역할

    //1️⃣ 키: 값 형태로 사용자가 입력한 정보를 formData에 담기
    Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
    });

    //2️⃣ 프로필 이미지가 있다면 formData에 추가
    if (profileImage) {
        if (Platform.OS === "web") {
            // 웹: 이미지 URI를 fetch로 불러와 Blob으로 변환
            const response = await fetch(profileImage.uri);
            const blob = await response.blob();
            formData.append("profileImage", new File([blob], profileImage.name, { type: profileImage.type }));
        } else {
            // 모바일: 직접 경로를 사용해 FormData에 추가
            formData.append("profileImage", {
                uri: profileImage.uri,
                name: profileImage.name,
                type: profileImage.type,
            } as any);
        }
    }

    //3️⃣ 서버에 POST 요청(회원가입 정보, 이미지 전송)
    return api.post("/user/userRegister", formData, {
        headers: { "Content-Type": "multipart/form-data" },//전송하는 데이터의 형식을 알려줌(필수)
    });
}