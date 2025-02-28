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
    console.log(OPENAI_API_KEY);
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
                        content: "당신은 창의적인 목표 생성기입니다. 사용자가 하루 동안 도전할 수 있는 재미있고 신박한 목표 3개를 만들어 주세요.\n" +
                            "목표는 한국인의 정서에 맞고, 한국에서 실천 가능한 것 이어야 합니다.\n" +
                            "최근 한국 트렌드를 반영하되, 항상 새로운 요소를 포함하세요.\n" +
                            "목표는 한 문장으로 간결하게 작성하고, 번호 없이 줄바꿈으로 출력하세요.\n",
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