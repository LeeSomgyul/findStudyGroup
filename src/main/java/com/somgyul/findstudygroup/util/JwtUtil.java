/*⭐JWT 토큰(로그인한 사용자가 누군지 검증하는 신분증) 생성 및 검증*/
package com.somgyul.findstudygroup.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;

@Component
public class JwtUtil {
    private static final String SECRET_KEY = Base64.getEncoder().encodeToString(Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 만료시간은 1시간

    private final Key key;

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    //1️⃣ JWT 토큰 생성
    public String generateToken(UserDetails userDetails) {
        //사용자의 권한을 'roles'에 저장
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());

        //JWT 토큰 본격 생성!
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    //2️⃣ JWT에서 데이터(claims) 가져오기
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    //3️⃣ JWT에서 사용자명(subject) 추출하기
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    //4️⃣ JWT에서 권한 정보 추출하기
    public List<String> extractRoles(String token){
        Claims claims = extractClaims(token);
        return (List<String>) claims.get("roles");
    }

    //5️⃣ JWT 토큰 만료 여부 확인
    private boolean isTokenExpired (String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    //6️⃣ JWT 토큰 검증(사용자와 토큰 정보가 옳은지, 토큰이 만료되었는지)
    public boolean validateToken(String token) {
        try{
            extractClaims(token);
            return !isTokenExpired(token);
        }catch (Exception e) {
            return false;
        }
    }
}
