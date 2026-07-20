package com.example.backend.dto;

import com.example.backend.entity.Quiz;
import java.util.List;

public record GeneratedLearningContent(
        JavaAnalysisResponse analysis,
        List<Quiz> quizzes,
        List<CodingProblemDraft> codingProblems) {
}
