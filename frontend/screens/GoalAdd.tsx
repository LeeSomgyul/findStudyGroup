import React, {useEffect, useState} from "react";
import {View, Text} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GoalAdd = () => {
    const [userId, setUserId] = useState<number|null>(null);
    const [selectedDate, setSelectedDate] = useState<string>("");

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

    return(
        <View>
            <Text>날짜 추가</Text>
            <Picker selectedValue={selectedDate} onValueChange={(itemValue) => setSelectedDate(itemValue)}>
                {getValidDates().map((date) => (
                    <Picker.Item key={date} label={date} value={date}/>
                ))}
            </Picker>
        </View>
    );
};

export default GoalAdd;