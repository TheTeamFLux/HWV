package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.entity.Quiz;
import com.example.backend.service.QuizService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
public class QuizController {
    private final QuizService quizService;
    public QuizController(QuizService quizService) { this.quizService = quizService; }

    @PostMapping({"/quiz", "/quiz/generate"})
    public List<Quiz> generate(@RequestBody GenerateQuizRequest request) { return quizService.generateQuiz(request.getCode(), request.getUserId()); }
    @GetMapping("/quiz")
    public List<Quiz> latest(@RequestParam Long userId) { return quizService.getLatestQuiz(userId); }
    @PostMapping("/quiz/result")
    public Map<String, Object> result(@RequestBody QuizResultRequest request) { return quizService.saveResult(request); }
    @GetMapping("/api/me/dashboard")
    public Map<String, Object> dashboard(@RequestParam Long userId) { return quizService.dashboard(userId); }
    @GetMapping("/api/me/wrong-notes")
    public List<Map<String, Object>> wrongNotes(@RequestParam Long userId) { return quizService.wrongNotes(userId); }
    @GetMapping("/api/me/statistics")
    public Map<String, Object> statistics(@RequestParam Long userId) { return quizService.statistics(userId); }
}
