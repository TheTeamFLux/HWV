package com.example.backend.dto;

import java.util.List;

public record CodingProblemTranslationDraft(String grammarName, String title, String description,
                                            String summary, List<String> requirements,
                                            List<String> testNames) {
}
