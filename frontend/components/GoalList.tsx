import React, {useCallback, useEffect, useState} from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {getGoalsByDate, updateGoalCompletion} from "@/constants/goalApi";

export interface Goal {
    goalId: number;
    userId: number;
    content: string;
    isCompleted: boolean;
    date: string;
}

export interface GoalListProps {
    selectedDate: string;
}

const GoalList = ({ selectedDate }: GoalListProps) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    // ✅ AsyncStorage에서 userId 가져오기
    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem("userId");
            if (storedUserId) {
                setUserId(Number(storedUserId));
            }
        };
        fetchUserId();
    }, []);

    // ✅ 선택한 날짜의 목표 가져오기
    const fetchGoals = async () => {
        if(userId && selectedDate){
            try{
                const goals = await getGoalsByDate(userId, selectedDate);
                setGoals(goals);
            }catch(error){
                console.error("선택한 날짜의 목표를 불러오지 못하였습니다.: ", error);
            }
        }
    };

    //✅ 화면에 다시 들어왔을때 추가된 목표 있다면 업데이트
    useFocusEffect(
        useCallback(() => {
            fetchGoals();
        },[userId, selectedDate])
    );


    // ✅ 목표 달성 상태 바꾸기(달성, 미달성)
    const toggleGoalCompletion = async (goalId: number, isCompleted: boolean) => {
        try{
            await updateGoalCompletion(goalId, isCompleted);
            setGoals((prevGoals) =>
                prevGoals.map((goal) =>
                    goal.goalId === goalId ? {...goal, isCompleted: !isCompleted} : goal));
        }catch(error){
            console.log("목표의 상태 변경에 실패하였습니다.: ", error);
        }
    };

    return (
        <View style={{ padding: 10 }}>
            {goals.length === 0 ? (
                <Text>아직 세운 목표가 없어요🫡</Text>
            ) : (
                <FlatList
                    data={goals}
                    keyExtractor={(item) => item.goalId.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => toggleGoalCompletion(item.goalId, item.isCompleted)}>
                            <Text>{item.content}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default GoalList;