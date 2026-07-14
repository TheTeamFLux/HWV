package com.example.backend.service;

import org.springframework.stereotype.Service;

@Service
public class ProblemGenerationService {

    private final GeminiService geminiService;

    public ProblemGenerationService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String generate(String code){

        return geminiService.analyzeAndGenerate(code);
    }
}
