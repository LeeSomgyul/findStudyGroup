import React, {useContext, useEffect, useState} from "react";
import { View, Text } from "react-native";
import {useNavigation} from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

import {AuthContext} from "@/app/authContext";
import GoalList from "../components/GoalList";


// ✅ 날짜를 YYYY년 MM월 DD일 형식으로 변환하는 함수
const formatDate = (date: string): string => {
    const [year, month, day] = date.split("-");
    return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const DailyCalendar = () => {
    const { auth } = useContext(AuthContext);
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState<string>(
        // 📌 초기값: 오늘 날짜 (YYYY-MM-DD 형식)
        new Date().toISOString().split("T")[0]
    );

    //1️⃣ 로그인하지 않은 사용자는 로그인 화면으로 이동
    useEffect(() => {
        if(!auth.isLoggedIn){
            navigation.navigate("Login" as never)
        }
    }, [auth.isLoggedIn]);

    //2️⃣ 달력 날짜 선택 시 상태 업데이트
    const handleDateChange = (day: { dateString: string }) => {
        setSelectedDate(day.dateString);
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {/* ✅ 상단: 선택된 날짜 */}
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                {formatDate(selectedDate)}
            </Text>

            {/* ✅ 캘린더 */}
            <Calendar
                onDayPress={handleDateChange}
                markedDates={{
                    [selectedDate]: { selected: true, selectedColor: "blue" },
                }}
            />

            {/* ✅ 목표 리스트 */}
            <GoalList selectedDate={selectedDate} />
        </View>
    );
};

export default DailyCalendar;