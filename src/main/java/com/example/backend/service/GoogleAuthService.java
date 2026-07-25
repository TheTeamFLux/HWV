package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String clientId;

    public GoogleAuthService(UserRepository userRepository,
                             PasswordEncoder passwordEncoder,
                             @Value("${google.client-id:}") String clientId) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.clientId = clientId;
    }

    @Transactional
    public User login(String credential) {
        if (clientId.isBlank()) {
            throw new IllegalStateException("Google 로그인 설정이 완료되지 않았습니다.");
        }
        if (credential == null || credential.isBlank()) {
            throw new IllegalArgumentException("Google 로그인 정보가 없습니다.");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) throw new IllegalArgumentException("유효하지 않은 Google 로그인 정보입니다.");

            GoogleIdToken.Payload payload = idToken.getPayload();
            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new IllegalArgumentException("Google에서 확인된 이메일만 사용할 수 있습니다.");
            }

            String subject = payload.getSubject();
            String email = payload.getEmail().trim().toLowerCase();
            String name = payload.get("name") instanceof String value && !value.isBlank()
                ? value : email.substring(0, email.indexOf('@'));

            return userRepository.findByGoogleSubject(subject).orElseGet(() -> {
                User user = userRepository.findByEmail(email).orElseGet(User::new);
                if (user.getGoogleSubject() != null && !user.getGoogleSubject().equals(subject)) {
                    throw new IllegalArgumentException("다른 Google 계정에 연결된 이메일입니다.");
                }
                if (user.getEmail() == null) {
                    user.setEmail(email);
                    user.setPassword(passwordEncoder.encode("GOOGLE_" + UUID.randomUUID()));
                }
                user.setName(name);
                user.setGoogleSubject(subject);
                return userRepository.save(user);
            });
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException("Google 로그인 정보를 확인하지 못했습니다.", exception);
        }
    }
}
