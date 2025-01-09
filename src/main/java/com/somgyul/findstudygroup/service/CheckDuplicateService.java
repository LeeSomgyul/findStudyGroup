package com.somgyul.findstudygroup.service;

import com.somgyul.findstudygroup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckDuplicateService {

    @Autowired
    private UserRepository userRepository;

    public boolean isDuplicate(String field, String value) {
        if("email".equals(field)) {
            return userRepository.existsByEmail(value);
        }else if("nickname".equals(field)) {
            return userRepository.existsByNickname(value);
        }else if("phone".equals(field)) {
            return userRepository.existsByPhone(value);
        }
        return false;
    }
}
