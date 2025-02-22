package com.somgyul.findstudygroup.service;

import com.somgyul.findstudygroup.dto.GoalDto;
import com.somgyul.findstudygroup.entity.Goal;
import com.somgyul.findstudygroup.entity.User;
import com.somgyul.findstudygroup.repository.GoalRepository;
import com.somgyul.findstudygroup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    /*✅ 목표 추가 기능*/
    public Goal createGoal(GoalDto goalDto) {
        //1️⃣ User entity에서 사용자(userId)가 존재하는지 찾기
        User user = userRepository
                .findById(goalDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        //2️⃣ 해당 날짜에 목표가 5개 이상 있다면 예외처리
        Long count = goalRepository.countByUserIdAndDate(user, goalDto.getDate());
        if(count >= 5){
            throw new RuntimeException("목표는 하루 최대 5개까지 가능합니다.");
        }

        //3️⃣ entity에 맞게 목표 생성
        Goal goal = Goal.builder()
                .user(user)
                .date(goalDto.getDate())
                .content(goalDto.getContent())
                .description(goalDto.getDescription())
                .isCompleted(false)
                .imageUrl(goalDto.getImageUrl())
                .build();

        //4️⃣ DB에 저장
        Goal savedGoal = goalRepository.save(goal);

        //5️⃣ 저장된 목표를 Dto로 변환해서 전달
        return GoalDto.fromEntity(savedGoal);
    }

    /*✅ 특정 날짜의 목표 가져오기*/
    public List<Goal> getGoalsByDate(Long userId, String date) {
        //1️⃣ User entity에서 사용자(userId)가 존재하는지 찾기
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        //2️⃣ goalRepository에 사용자(user)와 조회하고 싶은 날짜(date) 전달
        return goalRepository.findByUserIdAndDate(user, LocalDate.parse(date));
    }

    /*✅ 목표 달성 상태 바꾸기(달성, 미달성)*/
    public Goal updateGoalStatus(Long id, boolean isCompleted) {
        Goal goal = goalRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("해당 목표 id에 맞는 목표를 찾지 못하였습니다."));

        goal.setCompleted(isCompleted);
        return goalRepository.save(goal);
    }
}
