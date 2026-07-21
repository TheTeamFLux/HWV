package com.example.backend.service;

import com.example.backend.dto.CodingProblemDraft;
import com.example.backend.dto.GeneratedLearningContent;
import com.example.backend.dto.JavaAnalysisResponse;
import com.example.backend.entity.CodingProblem;
import com.example.backend.entity.JavaAnalysisCache;
import com.example.backend.entity.User;
import com.example.backend.repository.CodingProblemRepository;
import com.example.backend.repository.JavaAnalysisCacheRepository;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;

@Service
public class JavaLearningGenerationService {
    private static final String GENERATION_RULE_VERSION = "typed-arguments-v2";
    private final GeminiService geminiService;
    private final UserRepository userRepository;
    private final CodingProblemRepository problemRepository;
    private final JavaAnalysisCacheRepository cacheRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JavaLearningGenerationService(GeminiService geminiService, UserRepository userRepository,
                                         CodingProblemRepository problemRepository,
                                         JavaAnalysisCacheRepository cacheRepository) {
        this.geminiService = geminiService;
        this.userRepository = userRepository;
        this.problemRepository = problemRepository;
        this.cacheRepository = cacheRepository;
    }

    @Transactional
    public JavaAnalysisResponse generateAll(Long userId, String code, String difficulty) {
        if (userId == null) throw new IllegalArgumentException("로그인 후 Java 파일을 분석해 주세요.");
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        String normalizedCode = code.replace("\r\n", "\n").replace('\r', '\n');
        String sourceHash = hash(GENERATION_RULE_VERSION + "\n" + normalizedCode);
        JavaAnalysisCache cached = cacheRepository.findByUserAndSourceHash(user, sourceHash).orElse(null);
        if (cached != null) {
            return new JavaAnalysisResponse(cached.getSummary(), readGrammars(cached.getGrammarsJson()), cached.getSourceCode());
        }

        GeneratedLearningContent generated = geminiService.generateAll(normalizedCode, difficulty);

        List<CodingProblem> savedProblems = problemRepository.saveAll(generated.codingProblems().stream()
            .map(draft -> toEntity(user, draft)).toList());
        JavaAnalysisCache cache = new JavaAnalysisCache();
        cache.setUser(user);
        cache.setSourceHash(sourceHash);
        cache.setSummary(generated.analysis().summary());
        cache.setGrammarsJson(write(generated.analysis().grammars()));
        cache.setSourceCode(normalizedCode);
        cache.setProblemIdsJson(write(savedProblems.stream().map(CodingProblem::getId).toList()));
        cacheRepository.save(cache);
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
        problem.setMethodName(draft.methodName());
        problem.setReturnType(draft.returnType());
        problem.setParameterTypesJson(write(draft.parameterTypes()));
        problem.setDifficulty(draft.difficulty());
        problem.setTestsJson(write(draft.tests()));
        return problem;
    }

    private List<JavaAnalysisResponse.Grammar> readGrammars(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception exception) {
            throw new IllegalStateException("저장된 Java 분석 결과를 불러오지 못했습니다.", exception);
        }
    }

    private String hash(String code) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(code.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Java 코드 해시를 계산하지 못했습니다.", exception);
        }
    }

    private String write(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception exception) {
            throw new IllegalStateException("생성된 학습 데이터를 저장하지 못했습니다.", exception);
        }
    }
}
