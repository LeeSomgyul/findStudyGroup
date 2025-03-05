import axios from "axios";
import {API_BASE_URL, OPENAI_API_KEY} from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GoalParams = {
    userId: number | null;
    date: string;
    content: string;
}


//✅ ChateGPT로 랜덤 목표 가져오기
export const fetchRandomGoals = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
        //1️⃣ 목표 5개 받기
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "실현 가능하고 최신 트렌드를 포함하는 목표 3가지를 알려줘. 숫자, 기호 필요없고 문장은 간단하게 말해줘",
                    },
                ],
                temperature: 1.0, // 창의성을 높임
                max_tokens: 150, // 목표의 품질을 높이기 위해 토큰 수를 늘림
                top_p: 0.9, // 더 다양한 응답을 생성
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        //2️⃣ 하나의 문자열로 된 목표를 \n 기준으로 나누기
        const goalsText = response.data.choices[0].message.content;
        return goalsText.split("\n").filter((goal:string) => goal.trim() !== "");
    }catch(error){
        console.error("ChatGPT 목표 생성 실패:", error);
        return [];
    }
};

//✅ 사용자가 선택한 목표를 추가하기
export const createGoal = async ({userId, date, content}: GoalParams) => {
    const response = await axios.post(`${API_BASE_URL}/goals`, {
        userId, date, content,
    });
    return response.data;
}

//✅ 선택한 날짜의 목표 가져오기
export const getGoalsByDate = async (userId: number, date: string)=>{
    const token = await AsyncStorage.getItem("token");

    //📌 로그인하지 않은 상태에서 api 접근하는 경우 막기
    if (!token) {
        console.error("🚨 인증 토큰 없음: 로그인 후 다시 시도하세요.");
        throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도하세요.");
    }

    const response = await axios.get(`${API_BASE_URL}/goals`, {
        params:{userId, date},
        headers: {
            Authorization: `Bearer ${token}`,//📌 토큰 추가하여 사용자가 누군지 알기
        },
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