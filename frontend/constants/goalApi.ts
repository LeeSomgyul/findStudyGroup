import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;

const goalApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

//✅ 선택한 날짜의 목표 가져오기
export const getGoalsByDate = async (userId: number, date: string)=>{
    const response = await axios.get(`${API_BASE_URL}/goals`, {
        params:{userId, date}
    });
    return response.data;
}

// ✅ 목표 달성 상태 바꾸기(달성, 미달성)
export const updateGoalCompletion = async (goalId: number, isCompleted: boolean)=>{
    const response = await axios.post(`${API_BASE_URL}/goals/${goalId}/completion`,null,{
        params:{isCompleted: !isCompleted}
    });
    return response.data;
}