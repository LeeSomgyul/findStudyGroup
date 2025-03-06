/*⭐JWT 토큰(로그인한 사용자가 누군지 검증하는 신분증) 생성 및 검증*/
package com.somgyul.findstudygroup.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationTime;

    //✅ application.properies에 저장된 바이트(0,1)형태의 비밀키를 string 형태로 바꾸는 역할
    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-time}")long expirationTime) {
        byte[] decodedKey = Base64.getDecoder().decode(secret);
        this.key = Keys.hmacShaKeyFor(decodedKey);
        this.expirationTime = expirationTime;
    }

    //✅ 위에서 가져온 비밀키를 다른 코드에서 사용할 수 있도록 반환하는 역할
    public SecretKey getKey() {
        return key;
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
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
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

    //4️⃣ JWT 토큰 만료 여부 확인
    private boolean isTokenExpired (String token) {
        Claims claims = extractClaims(token);
        Date expiration = claims.getExpiration();
        System.out.println("🔥Expiration date: " + expiration);
        System.out.println("🔥Current date: " + new Date());
        return expiration.before(new Date());
    }

    //5️⃣ JWT 토큰 검증(사용자와 토큰 정보가 옳은지, 토큰이 만료되었는지)
    public boolean validateToken(String token) {
        try{
            System.out.println("🔥Extracting claims for token: " + token);
            Claims claims = extractClaims(token);
            System.out.println("🔥 Claims extracted: " + claims);

            // ✅ 토큰 만료 여부 확인
            boolean expired = isTokenExpired(token);
            System.out.println("🔥 Is token expired: " + expired);

            return !expired;
        }catch (Exception e) {
            System.out.println("🔥Validate token failed: " + e.getMessage());
            return false;
        }
    }
}
