package com.gts.keepnotes.service;

import com.gts.keepnotes.config.JwtUtil;
import com.gts.keepnotes.dto.AuthRequestDto;
import com.gts.keepnotes.dto.AuthResponseDto;
import com.gts.keepnotes.entity.User;
import com.gts.keepnotes.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public AuthResponseDto createUser (AuthRequestDto req){
        User user1 = new User();
        user1.setUsername(req.getUsername());
        user1.setPassword(encoder.encode(req.getPassword()));
        userRepository.save(user1);
        return new AuthResponseDto(jwtUtil.generateToken(req.getUsername()));
    }

    public AuthResponseDto login (AuthRequestDto req){
        User user2 = userRepository.findByUsername(req.getUsername())
                .orElseThrow(()-> new RuntimeException("User not found"));
        if(encoder.matches(req.getPassword(),user2.getPassword())){
            return new AuthResponseDto(jwtUtil.generateToken(req.getUsername()));

        } else {
            throw new RuntimeException("Invalid password provided");
        }
    }
}
