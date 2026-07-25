package com.example.backend.repository;

import com.example.backend.entity.QuizAttempt;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByAnsweredAtDesc(User user);
    List<QuizAttempt> findTop4ByUserOrderByAnsweredAtDesc(User user);
    List<QuizAttempt> findByUserAndCorrectFalseOrderByAnsweredAtDesc(User user);
    long countByUserAndCorrect(User user, boolean correct);
    long countByUserAndAnsweredAtAfter(User user, LocalDateTime after);
}
