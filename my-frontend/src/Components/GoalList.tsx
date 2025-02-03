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

    // ✅ 선택한 날짜의 목표 가져오기
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

    return(
        <div>

        </div>
    );
}

export default GoalList;