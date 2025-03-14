import React, {useCallback, useEffect, useState} from "react";
import {View, Text, FlatList, TouchableOpacity, ScrollView, Modal, TextInput, Button, Image} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {completeGoal, getGoalsByDate} from "@/constants/goalApi";

export interface Goal {
    goalId: number;
    userId: number;
    date: string;
    content: string;
    isCompleted: boolean;
    description: string;
    imageUrl: string;
}

export interface GoalListProps {
    selectedDate: string;
}

const GoalList = ({ selectedDate }: GoalListProps) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<Goal|null>(null);
    const [image, setImage] = useState<File|null>(null);
    const [description, setDescription] = useState<string>("");

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
                console.log("🔥목표 리스트: ", goals);
                setGoals(goals);
            }catch(error){
                console.error("목표 불러오기 실패.: ", error);
            }
        }
    };

    //✅ 화면에 다시 들어왔을때 추가된 목표 있다면 업데이트
    useFocusEffect(
        useCallback(() => {
            fetchGoals();
        },[userId, selectedDate])
    );

    //✅ 업로드 버튼
    const handleCompleteGoal = async () => {
        if(!selectedGoal || !image){
            window.alert("사진을 업로드해주세요!");
            return;
        }

        try{
            const updateGoal = await completeGoal(selectedGoal.goalId, image, description || undefined);
            setGoals(prevGoals =>
                prevGoals.map(goal =>
                    goal.goalId === updateGoal.goalId ? updateGoal : goal
                )
            );
            setSelectedGoal(null);
            setImage(null);
            setDescription("");
            window.alert("업로드 되었습니다!");
        }catch(error:any){
            console.log("🔥목표 사진, 설명 업로드 실패:", error);
            window.alert("업로드에 실패하였습니다.");
        }
    }

    return (
        <View style={{ padding: 10 }}>
            {goals.length === 0 ? (
                <Text>아직 세운 목표가 없어요🫡</Text>
            ) : (
                <>
                    {/*✅ 목표 리스트*/}
                    <FlatList
                        data={goals}
                        keyExtractor={(item) => item.goalId.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => !item.isCompleted && setSelectedGoal(item)}>
                                <Text>{item.content}{item.isCompleted ? "✅" : ""}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    {/* ✅ 완료된 목표의 이미지 & 설명을 가로 스크롤로 표시 */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {goals
                            .filter((goal) => goal.isCompleted && goal.imageUrl)
                            .map((goal) => (
                                <View key={goal.goalId}>
                                    <Image
                                        source={{uri: `http://localhost:8080${goal.imageUrl}`}}
                                        style={{ width: 200, height: 200 }}
                                    />
                                    <Text>{goal.description || ""}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>

                    {/* ✅ 이미지, 설명 등록하는 팝업(모달) */}
                    <Modal
                        visible={selectedGoal !== null}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setSelectedGoal(null)}
                    >
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"}}>
                            <View style={{ width: 300, padding: 20, backgroundColor: "white", borderRadius: 10}}>
                                <Text>{selectedGoal?.content}</Text>
                                <Text>인증샷 업로드(필수)📷</Text>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                />
                                <Text>설명(선택)✍️</Text>
                                <TextInput
                                    value={description}
                                    onChangeText={setDescription}
                                />
                                <Button title="업로드" onPress={handleCompleteGoal}/>
                                <Button
                                    title="취소"
                                    onPress={() => {
                                        setSelectedGoal(null);
                                        setImage(null);
                                        setDescription("");
                                    }}
                                />
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
};

export default GoalList;