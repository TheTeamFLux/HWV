package com.example.backend.controller;

import com.example.backend.entity.Quiz;
import com.example.backend.service.GeminiService;
import com.example.backend.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    private final GeminiService geminiService;
    private final QuizService quizService;

    public ProblemController(GeminiService geminiService,
                             QuizService quizService) {

        this.geminiService = geminiService;
        this.quizService = quizService;
    }

    @PostMapping("/generate")
    public List<Quiz> generate(@RequestBody Map<String, Object> request) {

        String code = (String) request.get("code");
        Long userId = Long.valueOf(request.get("userId").toString());

        return quizService.generateQuiz(code, userId);
    }
}