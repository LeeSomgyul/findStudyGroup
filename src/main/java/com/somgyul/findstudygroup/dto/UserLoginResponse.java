package com.somgyul.findstudygroup.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginResponse {
    private Long id;
    private String email;
    private String name;
    private String nickname;
    private String profileImage;

    public UserLoginResponse(Long id, String email, String name, String nickname, String profileImage) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.profileImage = profileImage;
    }
}
