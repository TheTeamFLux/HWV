package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UserServiceTest {
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder(4);
        userService = new UserService(userRepository, passwordEncoder);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void registrationStoresBcryptPassword() {
        User user = user("learner@example.com", "password123");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        userService.register(user);

        assertFalse("password123".equals(user.getPassword()));
        assertTrue(passwordEncoder.matches("password123", user.getPassword()));
    }

    @Test
    void loginAcceptsBcryptPassword() {
        User user = user("learner@example.com", passwordEncoder.encode("password123"));
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        userService.login(user.getEmail(), "password123");

        assertTrue(passwordEncoder.matches("password123", user.getPassword()));
    }

    @Test
    void legacyPlaintextPasswordMigratesAfterSuccessfulLogin() {
        User user = user("legacy@example.com", "old-password");
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        userService.login(user.getEmail(), "old-password");

        assertTrue(passwordEncoder.matches("old-password", user.getPassword()));
        verify(userRepository).save(user);
    }

    private User user(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName("학습자");
        return user;
    }
}
