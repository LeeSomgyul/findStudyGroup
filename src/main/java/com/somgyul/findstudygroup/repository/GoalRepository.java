package com.somgyul.findstudygroup.repository;

import com.somgyul.findstudygroup.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserIdAndDate(Long userId, LocalDate date);

    @Query("SELECT COUNT(g) FROM Goal g WHERE g.date = :date AND g.user.id = :userId AND g.isCompleted = true")
    int countCompletedGoalsByDate(@Param("date") String date, @Param("userId") Long userId);
}

