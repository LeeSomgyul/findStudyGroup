package com.somgyul.findstudygroup.service;

import com.somgyul.findstudygroup.dto.GoalDto;
import com.somgyul.findstudygroup.entity.Goal;
import com.somgyul.findstudygroup.entity.User;
import com.somgyul.findstudygroup.exception.*;
import com.somgyul.findstudygroup.repository.GoalRepository;
import com.somgyul.findstudygroup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {
    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    /*✅ 목표 추가 기능*/
    @Transactional
    public GoalDto createGoal(GoalDto goalDto) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(6);
        LocalDate goalDate = goalDto.getDate();

        //1️⃣ 이미 지나간 날짜에 대한 목표 추가 불가
        if(goalDate.isBefore(today)){
            throw new InvalidGoalDateException("이미 지난 날짜에는 목표를 추가할 수 없어요🥲");
        }

        //2️⃣ 오늘부터 7일 이내에 대한 목표만 추가 가능
        if(goalDate.isAfter(endDate)) {
            throw new InvalidGoalDateException("오늘부터 7일 이내의 목표만 추가할 수 있어요🥲");
        }

        //3️⃣ User entity에서 사용자(userId)가 존재하는지 찾기
        User user = userRepository
                .findById(goalDto.getUserId())
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        //4️⃣ 해당 날짜에 목표가 5개 이상 있다면 예외처리
        Long count = goalRepository.countByUserIdAndDate(user.getId(), goalDate);
        if(count >= 5){
            throw new GoalLimitExceededException("목표는 하루 최대 5개까지 가능합니다.");
        }

        //5️⃣ entity에 맞게 목표 생성
        Goal goal = Goal.builder()
                .user(user)
                .date(goalDate)
                .content(goalDto.getContent())
                .description(goalDto.getDescription())
                .isCompleted(false)
                .imageUrl(goalDto.getImageUrl())
                .build();

        Goal savedGoal = goalRepository.save(goal);

        //6️⃣ 저장된 목표를 Dto로 변환해서 전달
        return GoalDto.fromEntity(savedGoal);
    }

    /*✅ 특정 날짜의 목표 가져오기*/
    public List<GoalDto> getGoalsByDate(Long userId, LocalDate date) {

        //1️⃣ userId로 user 찾기
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        //2️⃣ 사용자의 목표 불러오기
        List<Goal> goals = goalRepository.findByUserAndDate(user, date);

        //3️⃣ Goal를 GoalDto로 변환
        return goals.stream().map(GoalDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    /*✅ 목표 완료 시 사진, 글 작성하기*/
    public GoalDto completeGoal(Long goalId, MultipartFile image, String description) {
        //1️⃣ DB에서 목표 찾기
        Goal goal = goalRepository
                .findById(goalId)
                .orElseThrow(()->new GoalNotFoundException("존재하지 않는 목표입니다."));

        //2️⃣ 이미 완료된 목표인 경우의 처리
        if(goal.isCompleted()){
            throw new GoalAlreadyCompletedException("이미 완료된 목표입니다.");
        }

        //3️⃣ 목표 완료 유무, 사진, 글 업로드
        String imageUrl = uploadImage(image);
        goal.setCompleted(true);
        goal.setImageUrl(imageUrl);
        if(description != null && !description.trim().isEmpty()){
            goal.setDescription(description);
        }

        Goal updatedGoal = goalRepository.save(goal);
        return GoalDto.fromEntity(updatedGoal);//📌Entity를 Dto로 변환해서 전달
    }

    /*✅ 사진 업로드 함수*/
    private String uploadImage(MultipartFile image) {
        try{
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            String uploadHeaderPath = "uploads/";
            File imageFile = new File(uploadHeaderPath + fileName);
            image.transferTo(imageFile);
            return "/uploads/" + fileName;
        }catch(IOException e){
            throw new ImageUploadFailedException("사진 업로드에 실패: " + e.getMessage());
        }
    }
}
