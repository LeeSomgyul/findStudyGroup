import axios from "axios";
import {API_BASE_URL, OPENAI_API_KEY} from "@/constants/constants";

type GoalParams = {
    userId: number | null;
    date: string;
    content: string;
}

const goalApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

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
                        content: "실현 가능하고 최신 트렌드를 반영한 랜덤 목표 3가지를 생성해줘.\n"+
                            "각 목표는 신박하고 실천할 수 있어야 해.\n"+
                            "한 문장으로 끝내고, '~하기' 형태로 작성해.\n"+
                            "설명 없이 간결하게, 문장 앞이나 안에 기호(+,-,*, 등)를 포함하지 마.\n"+
                            "예시:\n+"+
                            "배달 기사가 되어 직접 음식 배달해보기\n"+
                            "오래된 카페 방문하여 전통 차 마시기\n"+
                            "편의점에서 신상 과자 하나 사서 먹어보기",
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