package com.somgyul.findstudygroup.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//Request, Response 겸용
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GoalDto {
    private Long userId;
    private String date;
    private String content;
    private boolean isCompleted;
    private String description;
    private String imageUrl;
}
