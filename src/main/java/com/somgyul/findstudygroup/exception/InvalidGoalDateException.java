//⭐ [GoalService.java] 오늘, 내일에 대한 목표만 추가에 대한 예외
package com.somgyul.findstudygroup.exception;

public class InvalidGoalDateException extends RuntimeException {
    public InvalidGoalDateException(String message) {
        super(message);
    }
}
