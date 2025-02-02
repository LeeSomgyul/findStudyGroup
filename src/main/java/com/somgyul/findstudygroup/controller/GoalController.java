package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.GoalDto;
import com.somgyul.findstudygroup.entity.Goal;
import com.somgyul.findstudygroup.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;

    /*목표 추가 기능*/
    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody GoalDto goalDto) {
        Goal newGoal = goalService.createGoal(goalDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newGoal);
    }
}
