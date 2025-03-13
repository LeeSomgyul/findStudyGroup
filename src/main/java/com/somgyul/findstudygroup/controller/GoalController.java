package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.ApiResponse;
import com.somgyul.findstudygroup.dto.GoalDto;
import com.somgyul.findstudygroup.exception.GoalLimitExceededException;
import com.somgyul.findstudygroup.exception.InvalidGoalDateException;
import com.somgyul.findstudygroup.exception.UserNotFoundException;
import com.somgyul.findstudygroup.service.GoalService;
import com.somgyul.findstudygroup.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {
    private final GoalService goalService;
    private final UserService userService;

    /*✅ 목표 추가 기능*/
    @PostMapping
    public ResponseEntity<ApiResponse<GoalDto>> createGoal(@RequestBody GoalDto goalDto) {
        try{
            GoalDto newGoal = goalService.createGoal(goalDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(newGoal));
        }catch(GoalLimitExceededException | InvalidGoalDateException | UserNotFoundException error){
            return ResponseEntity.badRequest().body(ApiResponse.error(error.getMessage()));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("서버 오류가 발생하였습니다."));
        }
    }

    /*✅ 특정 날짜의 목표 가져오기*/
    @GetMapping
    public ResponseEntity<List<GoalDto>> getGoalsByDate(@RequestParam Long userId, @RequestParam String date) {
        try{
            LocalDate localDate = LocalDate.parse(date);
            List<GoalDto> goalDtos = goalService.getGoalsByDate(userId, localDate);

            return ResponseEntity.ok(goalDtos);
        }catch(Exception e){
            e.printStackTrace();

            return ResponseEntity.badRequest().body(null);
        }
    }

    /*✅ 목표 완료 시 사진, 글 작성하기*/
    @PutMapping("/{goalId}/complete")
    public ResponseEntity<ApiResponse<GoalDto>> completeGoal(
            @PathVariable Long goalId,
            @RequestPart("image") MultipartFile image,
            @RequestPart(value = "description", required = false) String description) {
        System.out.println("🔥controller로 goalId 전송 확인:" + goalId);
        try{
            GoalDto updateGoal = goalService.completeGoal(goalId, image, description);
            System.out.println("🔥service에서 처리 완료 확인: " + updateGoal);
            return ResponseEntity.ok(ApiResponse.success(updateGoal));
        }catch (Exception e){
            System.out.println("🔥service가기 전에 막힘: " + e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
