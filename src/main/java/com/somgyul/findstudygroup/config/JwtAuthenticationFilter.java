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
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.AntPathMatcher;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    //✅ 로그인,회원가입,프로필 이미지 요청은 필터에서 제외
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        AntPathMatcher pathMatcher = new AntPathMatcher();
        String path = request.getRequestURI();
        return pathMatcher.match("/api/user/**", path) || path.startsWith("/uploads/");
    }

    //✅ 사용자가 보낸 JWT를 확인해서 로그인한 상태인지 인증하는 과정(이 사람이 로그인된 사용자가 맞는가?)
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

       //1️⃣ Authorization 에서 헤더(Bearer)를 포함한 JWT 토큰 읽기
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        //📌 Bearer 를 제거함으로 이제 순수 token 이 됨
        String token = authHeader.substring(7);

        //📌 토큰이 빈 값이면 추출하지 않도록 추가
        if(token.isEmpty()){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("토큰이 유효하지 않습니다.");
            return;
        }

        try {
            //1️⃣ JWT에서 사용자 아이디(email), 전체 데이터(roles, exp 등)를 꺼냄
            String email = jwtUtil.extractEmail(token);
            Claims claims = jwtUtil.extractClaims(token);

            //2️⃣ 사용자가 로그인한 상태인지 확인하기
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                //📌 JWT가 유효한지 검사(만료, 위조 확인)
                if(jwtUtil.validateToken(token)) {
                    Object rolesObj = claims.get("roles");
                    List<String> roles = new ArrayList<>();

                    if(rolesObj instanceof List){
                        List<?> roleList = (List<?>) rolesObj;
                        for(Object role : roleList){
                            if(role instanceof Map){
                                Map<?, ?> roleMap = (Map<?, ?>) role;
                                String authority = (String) roleMap.get("authority");
                                if (authority != null) {
                                    roles.add(authority);
                                }
                            }else if (role instanceof String){
                                roles.add(role.toString());
                            }
                        }
                    }

                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    for(String role : roles){
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
