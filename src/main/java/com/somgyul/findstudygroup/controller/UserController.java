package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.UserLoginRequest;
import com.somgyul.findstudygroup.dto.UserLoginResponse;
import com.somgyul.findstudygroup.dto.UserRegisterRequest;
import com.somgyul.findstudygroup.entity.User;
import com.somgyul.findstudygroup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;

    //회원가입
    @PostMapping("/userRegister")
    public ResponseEntity<String> registerUser(
            @RequestPart("data") UserRegisterRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        try{

            System.out.println("🚀 [디버그] 받은 회원가입 요청: " + request);

            if (profileImage != null && !profileImage.isEmpty()) {
                System.out.println("📷 [디버그] 받은 프로필 이미지: " + profileImage.getOriginalFilename());
                System.out.println("📝 [디버그] 이미지 타입: " + profileImage.getContentType());
                System.out.println("📏 [디버그] 이미지 크기: " + profileImage.getSize() + " 바이트");
            } else {
                System.out.println("⚠️ [디버그] 프로필 이미지가 전달되지 않았습니다.");
            }

            userService.registerUser(request, profileImage);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공!");
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생");
        }
    }

    //이메일 중복 확인
    @GetMapping("/checkEmail")
    public ResponseEntity<String> checkEmail(@RequestParam String email) {
        if(userService.isEmailDuplicate(email)){
            return ResponseEntity.badRequest().body("이미 존재하는 아이디(이메일)입니다.");
        }
        return ResponseEntity.ok().body("사용 가능한 아이디(이메일)입니다.");
    }

    //닉네임 중복 확인
    @GetMapping("/checkNickname")
    public ResponseEntity<String> checkNickname(@RequestParam String nickname) {
        if(userService.isNicknameDuplicate(nickname)){
            return ResponseEntity.badRequest().body("이미 존재하는 닉네임입니다.");
        }
        return ResponseEntity.ok().body("사용 가능한 닉네임입니다.");
    }

    //로그인
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request) {
        UserLoginResponse response = userService.LoginUser(request);
        return ResponseEntity.ok(response);
    }

}
