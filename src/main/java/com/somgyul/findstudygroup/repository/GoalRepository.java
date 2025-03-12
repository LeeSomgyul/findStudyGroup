package com.somgyul.findstudygroup.repository;

import com.somgyul.findstudygroup.entity.Goal;
import com.somgyul.findstudygroup.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    //✅ 특정 사용자(user)가 특정 날짜(date)에 조회한 목표 가져오는 함수
    List<Goal> findByUserAndDate(User user, LocalDate date);

    //✅ 특정 사용자(user)가 특정 날짜(date)에 목표를 몇개 가지고 있는지 세는 함수
    Long countByUserIdAndDate(Long userId, LocalDate date);
}

