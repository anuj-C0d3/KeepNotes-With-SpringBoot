package com.gts.keepnotes.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String key = "s3cr3t_K3y!@#2025$AnujJWT^&*XyZ7890abcdEFGH";
    private final Key secret_key = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
    private final Long expiration = 1000 * 60 *60L;
    public String generateToken(String username){
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256,secret_key)
                .compact();


    }
    public String extractUsername (String token){
        return Jwts.parser().setSigningKey(secret_key).build().parseSignedClaims(token).getPayload().getSubject();

    }
}
