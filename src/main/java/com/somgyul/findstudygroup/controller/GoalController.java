package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.GoalDto;
import com.somgyul.findstudygroup.entity.Goal;
import com.somgyul.findstudygroup.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;

    /*✅ 목표 추가 기능*/
    @PostMapping
    public ResponseEntity<GoalDto> createGoal(@RequestBody GoalDto goalDto) {
        GoalDto newGoal = goalService.createGoal(goalDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newGoal);
    }

    /*✅ 특정 날짜의 목표 가져오기*/
    @GetMapping
    public ResponseEntity<List<GoalDto>> getGoalsByDate(@RequestParam Long userId, @RequestParam String date) {
        try{
            LocalDate localDate = LocalDate.parse(date);
            List<GoalDto> goalDtos = goalService.getGoalsByDate(userId, localDate);
            return ResponseEntity.ok(goalDtos);
        }catch(Exception e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    /*✅ 목표 달성 상태 바꾸기(달성, 미달성)*/
    @PostMapping("/{goalId}/completion")
    public ResponseEntity<GoalDto> updateGoalCompletion (@PathVariable Long goalId, @RequestBody boolean isCompleted) {
        try{
            //1️⃣ 목표 상태 정상 업데이트 하면 200 반환
            GoalDto updatedGoal = goalService.updateGoalCompletion(goalId, isCompleted);
            return ResponseEntity.ok(updatedGoal);
        }catch(RuntimeException e){
            //2️⃣ 목표를 찾을 수 없는 경우 404 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }catch(Exception e){
            //3️⃣ 기타 예외 발생 시 500 반환
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
