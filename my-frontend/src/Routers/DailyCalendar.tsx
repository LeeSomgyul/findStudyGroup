import React, {useState} from "react";
import Calendar, {CalendarProps} from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GoalList from "../Components/GoalList";

//✅ 날짜를 YYYY년 MM월 DD일 형식으로 변환하는 함수
const formatDate = (date: Date): string => {
    return date.toLocaleDateString("ko-KR",{
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const DailyCalendar:React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());//✅초기값은 오늘 날짜로 설정

    //✅달력 날짜를 클릭하면 해당 날짜를 저장
    const handleDateChange: CalendarProps["onChange"] = (value) => {
        if(value instanceof Date){
            setSelectedDate(value);
        }
    };

    return(
        <div>
            <div>
                {/*✅좌측: 캘린더*/}
                <h2>{formatDate(selectedDate)}</h2>
                <Calendar onChange={handleDateChange} value={selectedDate}/>
            </div>
            <div>
                {/*✅우측: 목표 리스트, 내용, 사진*/}
                <GoalList selectedDate={selectedDate.toISOString().split("T")[0]}/>
            </div>
        </div>
    );
};

export default DailyCalendar;