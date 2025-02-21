package com.somgyul.findstudygroup.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor // 모든 필드를 받는 생성자 추가
public class UserRegisterRequest {
    private String email;
    private String password;
    private String phone;
    private String name;
    private String birthDate;
    private String nickname;
}