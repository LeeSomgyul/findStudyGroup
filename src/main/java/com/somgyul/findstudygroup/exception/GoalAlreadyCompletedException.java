package com.somgyul.findstudygroup.exception;

public class GoalAlreadyCompletedException extends RuntimeException {
    public GoalAlreadyCompletedException(String message) {
        super(message);
    }
}
