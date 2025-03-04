package com.somgyul.findstudygroup.config;

import com.somgyul.findstudygroup.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    //✅ 로그인 및 회원가입 요청은 필터에서 제외
    //📌 설명: 로그인 요청(/api/user/login)은 토큰 없이 요청해야 함. 즉 로그인 요청은 JWT 검사를 하지 않고 바로 Controller로 보냄.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.equals("/api/user/login");
    }

    //✅ 사용자가 보낸 JWT를 확인해서 로그인한 상태인지 인증하는 과정(이 사람이 로그인된 사용자가 맞는가?)
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        //1️⃣ Authorization 에서 헤더(Bearer)를 포함한 JWT 토큰 읽기
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null && !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        //📌 Bearer 를 제거함으로 이제 순수 token 이 됨
        String token = authHeader.substring(7);

        try {
            //2️⃣ JWT에서 사용자 아이디(email), 전체 데이터(roles, exp 등)를 꺼냄
            String email = jwtUtil.extractEmail(token);
            Claims claims = jwtUtil.extractClaims(token);

            //3️⃣ 사용자가 로그인한 상태인지 확인하기
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                //📌 JWT가 유효한지 검사(만료, 위조 확인)
                if(jwtUtil.validateToken(token)) {
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    List<String> roles = (List<String>) claims.get("roles");

                    for(String role : roles) {
                        authorities.add(new SimpleGrantedAuthority(role));
                    }

                    //📌 로그인 완료!(JWT를 기반으로 로그인 객체 생성)
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            //4️⃣ 검증 실패 시 401 상태 반환
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("토큰이 만료되었습니다.");
            return;
        }

        //6️⃣ JWT가 유효하면 다음 단계 진행(컨트롤러 실행)
        filterChain.doFilter(request, response);
    }
}
