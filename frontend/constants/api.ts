import axios from "axios";

const API_BASE_URL = "http://192.168.45.24:8080/api";

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