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

        //목표 등록하려는 사용자가 누군지 찾기
        User user = userRepository
                .findById(goalDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        //사용자 있다면 새로운 목표 객체 생성
        Goal goal = new Goal();
        goal.setUser(user);
        goal.setDate(LocalDate.parse(goalDto.getDate()));//String 날짜를 LocalDate 로 변환 후 저장
        goal.setContent(goalDto.getContent());
        goal.setCompleted(false);
        goal.setDescription(goalDto.getDescription());
        goal.setImageUrl(goalDto.getImageUrl());

        //사용자가 입력한 목표를 DB에 저장
        return goalRepository.save(goal);
    }

    /*✅ 특정 날짜의 목표 가져오기*/
    public List<Goal> getGoalsByDate(Long userId, String date) {
        return goalRepository.findByUserIdAndDate(userId, LocalDate.parse(date));
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
