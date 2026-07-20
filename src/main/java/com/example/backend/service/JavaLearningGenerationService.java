package com.example.backend.service;

import com.example.backend.dto.CodingProblemDraft;
import com.example.backend.dto.GeneratedLearningContent;
import com.example.backend.dto.JavaAnalysisResponse;
import com.example.backend.entity.CodingProblem;
import com.example.backend.entity.User;
import com.example.backend.repository.CodingProblemRepository;
import com.example.backend.repository.QuizRepository;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JavaLearningGenerationService {
    private final GeminiService geminiService;
    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final CodingProblemRepository problemRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JavaLearningGenerationService(GeminiService geminiService, UserRepository userRepository,
                                         QuizRepository quizRepository, CodingProblemRepository problemRepository) {
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.problemRepository = problemRepository;
    }

    @Transactional
    public JavaAnalysisResponse generateAll(Long userId, String code) {
        if (userId == null) throw new IllegalArgumentException("로그인 후 Java 파일을 분석해 주세요.");
        GeneratedLearningContent generated = geminiService.generateAll(code);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        generated.quizzes().forEach(quiz -> quiz.setUser(user));
        quizRepository.saveAll(generated.quizzes());
        problemRepository.saveAll(generated.codingProblems().stream()
            .map(draft -> toEntity(user, draft)).toList());
        return generated.analysis();
    }

    private CodingProblem toEntity(User user, CodingProblemDraft draft) {
        CodingProblem problem = new CodingProblem();
        problem.setUser(user);
        problem.setGrammarName(draft.grammarName());
        problem.setTitle(draft.title());
        problem.setDescription(draft.description());
        problem.setRequirementsJson(write(draft.requirements()));
        problem.setInputExample(draft.inputExample());
        problem.setOutputExample(draft.outputExample());
        problem.setStarterCode(draft.starterCode());
        problem.setDifficulty(draft.difficulty());
        problem.setTestsJson(write(draft.tests()));
        return problem;
    }

    private String write(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("생성된 학습 데이터를 저장하지 못했습니다.", exception);
        }
    }
}
