package com.somgyul.findstudygroup.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    private String email;
    private String password;
    private String phone;
    private String name;
    private String birthDate;
    private String nickname;
}