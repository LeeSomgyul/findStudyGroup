import React, {useEffect, useState} from "react";
import axios from "axios";

interface Goal{
    id: number,
    content: string,
    isCompleted: boolean,
}

interface GoalListProps{
    selectedDate: string;
}

const GoalList: React.FC<GoalListProps> = ({selectedDate}) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const userId = Number(localStorage.getItem("userId"));

    //✅ 선택한 날짜의 목표 가져오기
    useEffect(()=>{
        if(selectedDate && userId){
            axios
                .get(`http://localhost:8080/api/goals?date=${selectedDate}&userId=${userId}`)
                .then((response)=>{
                    setGoals(response.data);
                })
                .catch((error)=>{
                    console.error("선택 날짜에 대한 목표를 불러오지 못했습니다.: ", error);
                });
        }
    }, [selectedDate, userId]);

    //✅ 목표 달성 상태 바꾸기(달성, 미달성)
    const toggleGoalCompletion = (id: number, isCompleted: boolean) => {
        axios
            .put(`http://localhost:8080/api/goals/${id}`, {isCompleted: !isCompleted})
            .then(()=>{
                setGoals((prevGoals) =>
                    prevGoals.map((goal) =>
                        goal.id === id ? {...goal, isCompleted: !isCompleted} : goal
                    )
                );
            })
            .catch((error) => {
                console.error("목표의 상태 변경에 실패하였습니다.: ", error);
            });
    };

    return(
        <div>
            {goals.length === 0 ? (
                <p>오늘은 목표를 세우지 않았어요🫡</p>
            ):(
                <ul>
                    {goals.map((goal) => (
                        <li key={goal.id}>
                            <input
                                type="checkbox"
                                checked={goal.isCompleted}
                                onChange={() => toggleGoalCompletion(goal.id, goal.isCompleted)}
                            />
                            {goal.content}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GoalList;