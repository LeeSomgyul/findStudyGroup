//⭐ [GoalService.java] User entity에서 사용자(userId)가 존재하는지 찾기에 대한 예외
package com.somgyul.findstudygroup.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
