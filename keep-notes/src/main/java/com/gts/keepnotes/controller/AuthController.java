package com.gts.keepnotes.controller;

import com.gts.keepnotes.dto.AuthRequestDto;
import com.gts.keepnotes.dto.AuthResponseDto;
import com.gts.keepnotes.entity.User;
import com.gts.keepnotes.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody AuthRequestDto req) {
        AuthResponseDto newUser = authService.createUser(req);
        return new ResponseEntity(newUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public AuthResponseDto login(@RequestBody AuthRequestDto req){
        return authService.login(req);
    }
}
