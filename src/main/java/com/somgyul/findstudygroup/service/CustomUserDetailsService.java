//⭐ Spring Security가 사용자 정보를 확인할 수 있도록 변환해주는 서비스
//즉, DB에서 가져온 원본 사용자 정보를 Spring Security가 이해할 수 있도록 변환하는 단계
package com.somgyul.findstudygroup.service;

import com.somgyul.findstudygroup.entity.User;
import com.somgyul.findstudygroup.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //✅ Spring Security가 로그인할 때 자동으로 가장 먼저 실행하는 함수
    @Override
    public UserDetails loadUserByUsername (String email) throws UsernameNotFoundException {

        //1️⃣ DB에서 사용자 찾기
        User user = userRepository
                .findByemail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다.: " + email));

        //2️⃣ DB에서 찾은 사용자 정보를 Spring Security가 이해할 수 있는 UserDetails로 변환
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
