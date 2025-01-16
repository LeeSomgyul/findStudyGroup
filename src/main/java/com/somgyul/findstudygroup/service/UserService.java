package com.somgyul.findstudygroup.service;

import com.somgyul.findstudygroup.dto.UserRegisterRequest;
import com.somgyul.findstudygroup.entity.User;
import com.somgyul.findstudygroup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //회원가입
    public void registerUser(UserRegisterRequest request, MultipartFile profileImage) {
        try {
            //중복확인
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
            }
            if (userRepository.existsByNickname(request.getNickname())) {
                throw new IllegalArgumentException("이미 사용중인 닉네임입니다.");
            }
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new IllegalArgumentException("이미 사용중인 휴대전화 번호입니다.");
            }

            //프로필 이미지 저장
            String profileImagePath = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + profileImage.getOriginalFilename();
                Path uploadPath = Paths.get("uploads"); // 프로필 이미지 저장할 폴더 지정
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath); //폴더 없으면 생성
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(profileImage.getInputStream(), filePath);
                profileImagePath = "/uploads/" + fileName;//데이터베이스에 저장할 '상대경로'
            }

            //나머지 입력값들 저장
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setName(request.getName());
            user.setBirthDate(request.getBirthDate());
            user.setNickname(request.getNickname());
            user.setProfileImage(profileImagePath);

            userRepository.save(user);
        }catch (IOException e){
            throw new RuntimeException("이미지 처리 중 오류 발생: ", e);
        }catch (IllegalArgumentException e){
            throw e;
        }catch (Exception e){
            throw new RuntimeException("회원가입 처리 중 오류 발생: ", e);
        }
    }

    //이메일 중복 확인
    public boolean isEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    //닉네임 중복 확인
    public boolean isNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}
