import React, {useEffect, useState} from "react";
import {View, Text, Button, FlatList, TouchableOpacity, Alert, Platform} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {fetchRandomGoals, createGoal} from "@/constants/goalApi";


const GoalAdd = () => {
    const [userId, setUserId] = useState<number|null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [randomGoals, setRandomGoals] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);//📌중복 클릭 방지

    const navigation = useNavigation();

    //✅ 들어오자마자 처음 실행되는 함수들
    useEffect(() => {
        //1️⃣ 목표를 추가하려는 사용자가 누군지 userId에 저장
        const fetchUserId = async () => {
          const storedUserId = await AsyncStorage.getItem("userId");
          if(storedUserId){
              setUserId(Number(storedUserId));
          }
        };
        fetchUserId();

        //2️⃣ 오늘 날짜를 기본값으로 설정
        const today = new Date();
        setSelectedDate(today.toISOString().split("T")[0]);
    }, []);

    //✅ 날짜 선택 가능 범위(오늘부터 7일 이내)
    const getValidDates = () => {
        const dates = [];
        const today = new Date();
        for(let i = 0; i<7; i++){
            const futureDate = new Date();
            futureDate.setDate(today.getDate() + i);
            const dateString = futureDate.toISOString().split("T")[0];
            dates.push(dateString);
        }
        return dates;
    };

    //✅ 랜덤 목표 가져오기
    const handleFetchRandomGoals = async () => {
        if(isLoading) return;
        setIsLoading(true);
        setErrorMessage("");

        const goals = await fetchRandomGoals();
        setRandomGoals(goals);

        setTimeout(() => setIsLoading(false), 2000);
    };

    //✅ 랜덤 목표 선택하기
    const handleSelectGoal = (goal: string) => {
        //1️⃣ 이미 선택된 목표를 다시 누르면 선택 취소되기
        if(selectedGoals.includes(goal)){
            setSelectedGoals(selectedGoals.filter((item) => item !== goal));
        }else{
            //2️⃣ 목표를 5개 이상 선택하면 경고 메시지
            if(selectedGoals.length >= 5){
                setErrorMessage("하루 목표는 최대 5개까지 선택 가능합니다.");
                return;
            }
            //3️⃣ 목표 추가
            setSelectedGoals([...selectedGoals, goal]);
            setErrorMessage("");
        }
    };

    //✅ 목표 추가 확정 버튼
    const handleAddGoals = async () => {
        if(selectedGoals.length === 0){
            if(Platform.OS === 'web'){
                window.alert("목표를 선택해주세요.");
            }else{
                Alert.alert("목표를 선택해주세요!");
            }
            return;
        }
        try{
            await Promise.all(
                selectedGoals.map((goal) =>
                    createGoal({userId, date: selectedDate, content: goal})
                )
            );
            if(Platform.OS === 'web'){
                window.alert("목표가 추가되었습니다.");
            }else{
                Alert.alert("목표가 추가되었습니다.");
            }
            navigation.goBack();
        }catch (error:any){
            const errorMessage = error.response?.data?.message || "목표 추가에 실패하였습니다.";
            if(Platform.OS === 'web'){
                window.alert(errorMessage);
            }else{
                Alert.alert(errorMessage);
            }
        }
    };

    return(
        <View>
            <Text>날짜 추가</Text>
            <Picker selectedValue={selectedDate} onValueChange={(itemValue) => setSelectedDate(itemValue)}>
                {getValidDates().map((date) => (
                    <Picker.Item key={date} label={date} value={date}/>
                ))}
            </Picker>
            <Button title="랜덤 목표 생성하기🚩" onPress={handleFetchRandomGoals} disabled={isLoading}/>
            {randomGoals.length > 0 ? (
                <FlatList
                    data={randomGoals}
                    keyExtractor={(item) => item}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => handleSelectGoal(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            ):(
                <Text>버튼을 눌러 목표를 생성해보세요!‍️</Text>
            )}
            <Text>선택한 목표</Text>
            <FlatList
                data={selectedGoals}
                keyExtractor={(item) => item}
                renderItem={({item}) =>
                    <Text>✔️{item}</Text>
            }/>
            {errorMessage ? <Text>{errorMessage}</Text> : null}
            <Button title="목표 추가" onPress={handleAddGoals}/>
        </View>
    );
};

export default GoalAdd;