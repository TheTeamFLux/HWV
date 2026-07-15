package com.example.backend.service;

import com.example.backend.dto.QuizResultRequest;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final GeminiService geminiService;
    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserRepository userRepository;

    public QuizService(GeminiService geminiService, QuizRepository quizRepository,
                       QuizAttemptRepository attemptRepository, UserRepository userRepository) {
        this.geminiService = geminiService; this.quizRepository = quizRepository;
        this.attemptRepository = attemptRepository; this.userRepository = userRepository;
    }

    @Transactional
    public List<Quiz> generateQuiz(String code, Long userId) {
        User user = user(userId);
        List<Quiz> quizzes = geminiService.generateQuiz(code);
        quizzes.forEach(quiz -> quiz.setUser(user));
        return quizRepository.saveAll(quizzes);
    }

    public List<Quiz> getLatestQuiz(Long userId) { return quizRepository.findTop5ByUserOrderByCreatedAtDescIdDesc(user(userId)); }

    @Transactional
    public Map<String, Object> saveResult(QuizResultRequest request) {
        User user = user(request.getUserId());
        int correct = 0;
        List<Map<String, Object>> wrongAnswers = new ArrayList<>();
        for (QuizResultRequest.Answer answer : request.getAnswers()) {
            Quiz quiz = quizRepository.findById(answer.getQuizId()).orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));
            if (!quiz.getUser().getId().equals(user.getId())) throw new IllegalArgumentException("다른 사용자의 문제입니다.");
            boolean isCorrect = answer.getSelectedAnswer() != null && answer.getSelectedAnswer() == quiz.getAnswer();
            QuizAttempt attempt = new QuizAttempt(); attempt.setUser(user); attempt.setQuiz(quiz);
            attempt.setSelectedAnswer(answer.getSelectedAnswer() == null ? 0 : answer.getSelectedAnswer()); attempt.setCorrect(isCorrect);
            attemptRepository.save(attempt);
            if (isCorrect) correct++; else wrongAnswers.add(Map.of("quizId", quiz.getId(), "question", quiz.getQuestion(),
                "grammarName", quiz.getGrammarName(), "selectedAnswer", attempt.getSelectedAnswer(), "correctAnswer", quiz.getAnswer(),
                "explanation", quiz.getExplanation()));
        }
        return Map.of("correctCount", correct, "wrongCount", request.getAnswers().size() - correct, "wrongAnswers", wrongAnswers);
    }

    public Map<String, Object> dashboard(Long userId) {
        User user = user(userId); long generated = quizRepository.countByUser(user);
        long correct = attemptRepository.countByUserAndCorrect(user, true), wrong = attemptRepository.countByUserAndCorrect(user, false);
        long total = correct + wrong;
        List<Map<String, Object>> recent = attemptRepository.findByUserOrderByAnsweredAtDesc(user).stream().limit(4).map(this::attemptMap).toList();
        Map<String, Object> result = new LinkedHashMap<>(); result.put("generatedProblems", generated); result.put("correctAnswers", correct);
        result.put("incorrectAnswers", wrong); result.put("accuracy", total == 0 ? 0 : Math.round(correct * 100.0 / total)); result.put("recentAttempts", recent);
        return result;
    }

    public List<Map<String, Object>> wrongNotes(Long userId) {
        return attemptRepository.findByUserOrderByAnsweredAtDesc(user(userId)).stream().filter(a -> !a.isCorrect()).map(this::attemptMap).toList();
    }

    public Map<String, Object> statistics(Long userId) {
        User user = user(userId); Map<String, Object> result = new LinkedHashMap<>(dashboard(userId));
        List<QuizAttempt> attempts = attemptRepository.findByUserOrderByAnsweredAtDesc(user);
        Map<String, List<QuizAttempt>> byGrammar = attempts.stream().collect(Collectors.groupingBy(a -> a.getQuiz().getGrammarName()));
        result.put("categoryAccuracy", byGrammar.entrySet().stream().map(e -> Map.of("name", e.getKey(), "value",
            Math.round(e.getValue().stream().filter(QuizAttempt::isCorrect).count() * 100.0 / e.getValue().size()))).toList());
        List<Long> weekly = new ArrayList<>(); LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) { LocalDate day = today.minusDays(i); LocalDateTime start = day.atStartOfDay(), end = day.plusDays(1).atStartOfDay();
            weekly.add(attempts.stream().filter(a -> !a.getAnsweredAt().isBefore(start) && a.getAnsweredAt().isBefore(end)).count()); }
        result.put("weeklyAttempts", weekly); return result;
    }

    private Map<String, Object> attemptMap(QuizAttempt a) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", a.getId()); result.put("quizId", a.getQuiz().getId()); result.put("problemId", a.getQuiz().getId());
        result.put("problemTitle", a.getQuiz().getQuestion()); result.put("grammarName", a.getQuiz().getGrammarName());
        result.put("correct", a.isCorrect()); result.put("selectedAnswer", a.getSelectedAnswer());
        result.put("correctAnswer", a.getQuiz().getAnswer()); result.put("explanation", a.getQuiz().getExplanation());
        result.put("submittedAt", a.getAnsweredAt().toString()); result.put("passedCount", a.isCorrect() ? 1 : 0);
        result.put("totalCount", 1); result.put("passed", a.isCorrect());
        return result;
    }
    private User user(Long id) { return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")); }
}
