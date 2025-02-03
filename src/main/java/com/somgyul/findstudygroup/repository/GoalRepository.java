package com.somgyul.findstudygroup.repository;

import com.somgyul.findstudygroup.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserIdAndDate(Long userId, LocalDate date);
}

