import React, {useState} from "react";
import Calendar, {CalendarProps} from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DailyCalendar:React.FC = () => {
    const [date, setDate] = useState<Date>(new Date());

    //value 가 date 타입일때만 setDate 업데이트
    const handleDateChange: CalendarProps["onChange"] = (value) => {
        if(value instanceof Date){
            setDate(value);
        }
    }

    return(
        <div>
            {/*현재 년월일*/}
            <h2>{date.toLocaleDateString("ko-KR")}</h2>

            <Calendar onChange={handleDateChange} value={date}/>
        </div>
    );
};

export default DailyCalendar;