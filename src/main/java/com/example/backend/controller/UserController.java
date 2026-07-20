package com.example.backend.controller;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.GoogleLoginRequest;
import com.example.backend.service.GoogleAuthService;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final GoogleAuthService googleAuthService;

    public UserController(UserService userService, GoogleAuthService googleAuthService) {
        this.userService = userService;
        this.googleAuthService = googleAuthService;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setName(request.getName());

        userService.register(user);

        return Map.of("message", "회원가입 성공!");
    }
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        User user = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return Map.of(
                "message", "로그인 성공!",
                "userId", user.getId(),
                "name", user.getName()
        );
    }

    @PostMapping("/google")
    public Map<String, Object> googleLogin(@RequestBody GoogleLoginRequest request) {
        User user = googleAuthService.login(request.credential());
        return Map.of(
                "message", "Google 로그인 성공!",
                "userId", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        );
    }
}

