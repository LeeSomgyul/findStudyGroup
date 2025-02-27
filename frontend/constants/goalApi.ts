import axios from "axios";
import {API_BASE_URL, OPENAI_API_KEY} from "@/constants/constants";

const goalApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

//✅ ChateGPT로 랜덤 목표 가져오기
export const fetchRandomGoals = async () => {
    try {
        //1️⃣ 목표 3개 받기
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "당신은 창의적인 목표 생성기입니다. 사용자가 하루 동안 도전할 수 있는 재미있고 신박한 목표 3개를 생성하세요. 목표는 예상치 못한 행동을 유도하는 방식으로 작성해야 합니다. 예를 들어, '평소 가보지 않은 길로 집에 가보기', '배달 앱을 이용해 직접 배달원 체험해보기' 같은 방식이어야 합니다. 목표는 간결하면서도 실행 가능한 형태로 제공하세요.",
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