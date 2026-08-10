package com.example.backend.service;

import com.example.backend.entity.PasswordResetToken;
import com.example.backend.entity.User;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class PasswordResetService {
    private final UserRepository users;
    private final PasswordResetTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();
    private final String frontendUrl;
    private final String mailFrom;

    public PasswordResetService(UserRepository users, PasswordResetTokenRepository tokens,
                                PasswordEncoder encoder, JavaMailSender mailSender,
                                @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl,
                                @Value("${app.mail-from:}") String mailFrom) {
        this.users = users; this.tokens = tokens; this.encoder = encoder;
        this.mailSender = mailSender; this.frontendUrl = frontendUrl.replaceAll("/$", ""); this.mailFrom = mailFrom;
    }

    @Transactional
    public void request(String email) {
        User user = users.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (user == null) return; // Do not reveal whether an account exists.
        tokens.deleteByUser(user);
        byte[] bytes = new byte[32]; random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user); token.setTokenHash(hash(rawToken));
        token.setExpiresAt(LocalDateTime.now().plusMinutes(30)); tokens.save(token);

        SimpleMailMessage message = new SimpleMailMessage();
        if (mailFrom != null && !mailFrom.isBlank()) message.setFrom(mailFrom);
        message.setTo(user.getEmail()); message.setSubject("[HWV] 비밀번호 재설정");
        message.setText("아래 링크에서 30분 이내에 비밀번호를 재설정해 주세요.\n\n" +
            frontendUrl + "/reset-password?token=" + rawToken + "\n\n요청하지 않았다면 이 메일을 무시하세요.");
        mailSender.send(message);
    }

    @Transactional
    public void confirm(String rawToken, String newPassword) {
        PasswordResetToken token = tokens.findByTokenHash(hash(rawToken))
            .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 재설정 링크입니다."));
        if (token.getUsedAt() != null || token.getExpiresAt().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("만료되었거나 이미 사용한 재설정 링크입니다.");
        if (newPassword.getBytes(StandardCharsets.UTF_8).length > 72)
            throw new IllegalArgumentException("비밀번호가 너무 깁니다. UTF-8 기준 72바이트 이하로 입력해 주세요.");
        token.getUser().setPassword(encoder.encode(newPassword));
        token.setUsedAt(LocalDateTime.now());
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) { throw new IllegalStateException("토큰을 처리할 수 없습니다.", exception); }
    }
}
