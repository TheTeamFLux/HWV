package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    public String summarize(String text) {

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of(
                                                "text",
                                                "다음 내용을 핵심만 한국어로 요약해줘.\n\n" + text
                                        )
                                }
                        )
                }
        );

        Map response = webClient.post()
                .uri("/v1beta/models/gemini-flash-latest:generateContent")
                .header("X-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        try {
            var candidates = (java.util.List<?>) response.get("candidates");
            var candidate = (Map<?, ?>) candidates.get(0);
            var content = (Map<?, ?>) candidate.get("content");
            var parts = (java.util.List<?>) content.get("parts");
            var part = (Map<?, ?>) parts.get(0);

            return part.get("text").toString();

        } catch (Exception e) {
            return "요약 실패";
        }
    }
}
