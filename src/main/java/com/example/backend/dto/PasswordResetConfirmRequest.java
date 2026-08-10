package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordResetConfirmRequest(
    @NotBlank(message = "재설정 토큰이 없습니다.") String token,
    @NotBlank(message = "새 비밀번호를 입력해 주세요.")
    @Size(min = 8, message = "비밀번호는 8자 이상 입력해 주세요.") String password
) {}
