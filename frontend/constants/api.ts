import axios from "axios";
import Constants from 'expo-constants';

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
    return api.get("/api/user/checkEmail", {params: {email} });
}

//✅ 회원가입 중복확인(닉네임)
export const checkNicknameApi = async (nickname: string) => {
    return api.get("/api/user/checkNickname", {params: {nickname} });
}