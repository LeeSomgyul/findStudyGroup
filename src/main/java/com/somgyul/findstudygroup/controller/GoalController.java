package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.GoalDto;
import com.somgyul.findstudygroup.entity.Goal;
import com.somgyul.findstudygroup.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;

    /*✅ 목표 추가 기능*/
    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody GoalDto goalDto) {
        Goal newGoal = goalService.createGoal(goalDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newGoal);
    }

    /*✅ 특정 날짜의 목표 가져오기*/
    @GetMapping
    public ResponseEntity<List<Goal>> getGoalsByDate(@RequestParam Long userId, @RequestParam String date) {
        List<Goal> goals = goalService.getGoalsByDate(userId, date);
        return ResponseEntity.ok(goals);
    }

    /*✅ 목표 달성 상태 바꾸기(달성, 미달성)*/
    @PostMapping("/{id}")//URL 에서 해당 목표 id를 가져옴
    public ResponseEntity<Goal> updateGoalStatus (@PathVariable Long id, @RequestBody GoalDto goalDto) {
        Goal updatedGoal = goalService.updateGoalStatus(id, goalDto.isCompleted());
        return ResponseEntity.ok(updatedGoal);
    }
}
