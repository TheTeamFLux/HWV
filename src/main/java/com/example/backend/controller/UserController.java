package com.example.backend.controller;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.GoogleLoginRequest;
import com.example.backend.service.GoogleAuthService;
import com.example.backend.dto.PasswordResetRequest;
import com.example.backend.dto.PasswordResetConfirmRequest;
import com.example.backend.service.PasswordResetService;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final GoogleAuthService googleAuthService;
    private final PasswordResetService passwordResetService;

    public UserController(UserService userService, GoogleAuthService googleAuthService, PasswordResetService passwordResetService) {
        this.userService = userService;
        this.googleAuthService = googleAuthService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/password-reset/request")
    public Map<String, String> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        passwordResetService.request(request.email());
        return Map.of("message", "가입된 계정이라면 비밀번호 재설정 메일을 전송했습니다.");
    }

    @PostMapping("/password-reset/confirm")
    public Map<String, String> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.confirm(request.token(), request.password());
        return Map.of("message", "비밀번호가 변경되었습니다.");
    }

    @PostMapping("/register")
    public Map<String, String> register(@Valid @RequestBody RegisterRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setName(request.getName());

        userService.register(user);

        return Map.of("message", "회원가입 성공!");
    }
    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {

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
