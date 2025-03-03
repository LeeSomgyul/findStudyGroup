package com.somgyul.findstudygroup.service;

import com.somgyul.findstudygroup.dto.UserLoginRequest;
import com.somgyul.findstudygroup.dto.UserLoginResponse;
import com.somgyul.findstudygroup.dto.UserRegisterRequest;
import com.somgyul.findstudygroup.entity.User;
import com.somgyul.findstudygroup.repository.UserRepository;
import com.somgyul.findstudygroup.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class UserService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(AuthenticationManager authenticationManager,UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /*✅ 회원가입*/
    public void registerUser(UserRegisterRequest request, MultipartFile profileImage) {
        try {
            //1️⃣ 중복확인
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
            }
            if (userRepository.existsByNickname(request.getNickname())) {
                throw new IllegalArgumentException("이미 사용중인 닉네임입니다.");
            }

            //2️⃣ 프로필 이미지 저장
            String profileImagePath = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                //📌 원본 파일 이름 가져오기
                String originalFilename = profileImage.getOriginalFilename();
                //📌 파일 확장자 있으면 기본확장자 사용, 없으면 .jpg 붙이기
                String fileExtension = (originalFilename != null && originalFilename.contains("."))
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : ".jpg";
                //📌 '초'를 사용하여 파일명 고유하게 생성
                String fileName = System.currentTimeMillis() + fileExtension;
                //📌 이미지를 저장할 폴더 경로 설정
                Path uploadPath = Paths.get("uploads");

                //📌 upload폴더 없으면 생성하기
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                //📌 최종 이미지 저장 경로 저장(upload경로 + fileName)
                Path filePath = uploadPath.resolve(fileName);
                //📌 이미지 파일을 최종 경로에 저장
                Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                //📌 DB에 저장할 이미지 경로
                profileImagePath = "/uploads/" + fileName;
            }

            //3️⃣ 사용자 정보를 DB에 저장
            User user = new User();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhone(request.getPhone());
            user.setName(request.getName());
            user.setBirthDate(request.getBirthDate());
            user.setNickname(request.getNickname());
            user.setProfileImage(profileImagePath);

            //4️⃣ DB에 최종 저장
            userRepository.save(user);
        }catch (IOException e){
            throw new RuntimeException("이미지 처리 중 오류 발생: ", e);
        }catch (IllegalArgumentException e){
            throw e;
        }catch (Exception e){
            throw new RuntimeException("회원가입 처리 중 오류 발생: ", e);
        }
    }

    /*✅ 이메일 중복 확인*/
    public boolean isEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    /*✅ 닉네임 중복 확인*/
    public boolean isNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    /*✅ 로그인*/
    public UserLoginResponse LoginUser(UserLoginRequest request) {
        System.out.println("🔥 로그인 요청 받음: " + request.getEmail());

        //1️⃣ 사용자가 입력한 이메일, 비밀번호를 Spring Security 전송하여 확인해보기
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        System.out.println("🔥 사용자 인증 성공: " + authentication.getName()); // ✅ 성공 로그 추가

        //2️⃣ 사용자 정보 가져오기
        User user = userRepository
                .findByemail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        //3️⃣ 기본 프로필 설정
        String profileImage = user.getProfileImage();
        if(profileImage == null || profileImage.isEmpty()) {
            profileImage = "/uploads/기본프로필.jpg";
        }

        //4️⃣ 토큰 생성
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(userDetails);

        System.out.println("🔥 JWT 생성 성공: " + token);

        return new UserLoginResponse(user.getId(), user.getEmail(), user.getName(), user.getNickname(), profileImage, token);
    }
}
