package com.somgyul.findstudygroup.controller;

import com.somgyul.findstudygroup.dto.UserRegisterRequest;
import com.somgyul.findstudygroup.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/userRegister")
    public ResponseEntity<String> registerUser(@RequestBody UserRegisterRequest request) {
        try{
            userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("회원가입 성공!");
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생");
        }
    }
}
