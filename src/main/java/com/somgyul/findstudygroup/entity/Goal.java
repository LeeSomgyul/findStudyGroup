package com.somgyul.findstudygroup.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Column(length = 255,nullable = false)
    private String content;

    @Column(nullable = false)
    private boolean isCompleted = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private LocalDateTime createdAt;

    //📌 createdAt 자동 생성
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
