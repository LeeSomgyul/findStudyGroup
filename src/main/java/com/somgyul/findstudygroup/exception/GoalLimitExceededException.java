//⭐ [GoalService.java] 해당 날짜에 목표가 5개 이상 있을 시 예외처리
package com.somgyul.findstudygroup.exception;

public class GoalLimitExceededException extends RuntimeException {
    public GoalLimitExceededException(String message) {
        super(message);
    }
}
