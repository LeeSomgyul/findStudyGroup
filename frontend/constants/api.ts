import axios from "axios";
import Constants from 'expo-constants';

//타입 정리
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

// ✅ 로그인 API
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
    const formData = new FormData();

    // JSON 데이터를 Blob(이미지, 파일 다룸)으로 변환하여 FormData에 추가
    //formData.append(
    //    "data",
    //    new Blob([JSON.stringify(userData)], {type: "application/json"})
    //);

    Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
    });


    //프로필 이미지가 있을 경우 formData에 추가
    if(profileImage){
        const response = await fetch(profileImage.uri);
        const blob = await response.blob();

        formData.append("profileImage", new File([blob], profileImage.name, { type: profileImage.type }));
    }

    return api.post("/user/userRegister", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}