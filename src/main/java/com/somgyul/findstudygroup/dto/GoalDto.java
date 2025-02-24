package com.somgyul.findstudygroup.dto;

import com.somgyul.findstudygroup.entity.Goal;
import lombok.*;

import java.time.LocalDate;

//Request, Response 겸용
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GoalDto {
    private Long goalId;
    private Long userId;
    private LocalDate date;
    private String content;
    private boolean isCompleted;
    private String description;
    private String imageUrl;

    //✅ Entity -> Dto로 변환
    public static GoalDto fromEntity(Goal goal) {
        return GoalDto.builder()
                .goalId(goal.getId())
                .userId(goal.getUser() != null ? goal.getUser().getId() : null)
                .date(goal.getDate())
                .content(goal.getContent())
                .isCompleted(goal.isCompleted())
                .description(goal.getDescription())
                .imageUrl(goal.getImageUrl())
                .build();
    }
}
