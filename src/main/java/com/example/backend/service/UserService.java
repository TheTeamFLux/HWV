package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.regex.Pattern;

@Service
public class UserService {
    private static final int MIN_PASSWORD_LENGTH = 8;
    private static final int BCRYPT_MAX_PASSWORD_BYTES = 72;
    private static final Pattern BCRYPT_HASH =
        Pattern.compile("^\\$2[ayb]\\$\\d{2}\\$[./A-Za-z0-9]{53}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        validateNewPassword(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        String storedPassword = user.getPassword();
        boolean encodedPassword = storedPassword != null && BCRYPT_HASH.matcher(storedPassword).matches();
        boolean passwordMatches = encodedPassword
            ? passwordEncoder.matches(password, storedPassword)
            : constantTimeEquals(password, storedPassword);

        if (!passwordMatches) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        if (!encodedPassword) {
            validateBcryptLength(password);
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }
        return user;
    }

    private void validateNewPassword(String password) {
        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalArgumentException("비밀번호는 8자 이상 입력해 주세요.");
        }
        validateBcryptLength(password);
    }

    private void validateBcryptLength(String password) {
        if (password == null
            || password.getBytes(StandardCharsets.UTF_8).length > BCRYPT_MAX_PASSWORD_BYTES) {
            throw new IllegalArgumentException("비밀번호가 너무 깁니다. UTF-8 기준 72바이트 이하로 입력해 주세요.");
        }
    }

    private boolean constantTimeEquals(String rawPassword, String storedPassword) {
        if (rawPassword == null || storedPassword == null) return false;
        return MessageDigest.isEqual(
            rawPassword.getBytes(StandardCharsets.UTF_8),
            storedPassword.getBytes(StandardCharsets.UTF_8)
        );
    }
}
