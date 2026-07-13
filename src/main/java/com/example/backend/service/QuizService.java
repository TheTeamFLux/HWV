package com.example.backend.service;

import com.example.backend.entity.Quiz;
import com.example.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final GeminiService geminiService;
    private final QuizRepository quizRepository;

    public QuizService(GeminiService geminiService,
                       QuizRepository quizRepository) {

        this.geminiService = geminiService;
        this.quizRepository = quizRepository;
    }

    public List<Quiz> generateQuiz(String summary){

        List<Quiz> quizList =
                geminiService.generateQuiz(summary);

        return quizRepository.saveAll(quizList);
    }

}
