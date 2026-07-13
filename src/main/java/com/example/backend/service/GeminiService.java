package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.example.backend.entity.Quiz;
import java.util.ArrayList;
import java.util.List;

import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    private String callGemini(String prompt) {

        try {

            Map<String, Object> body = Map.of(
                    "contents", new Object[]{
                            Map.of(
                                    "parts", new Object[]{
                                            Map.of("text", prompt)
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

            System.out.println(response);

            var candidates = (List<?>) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "Gemini 응답에 candidates가 없습니다.\n" + response;
            }

            var candidate = (Map<?, ?>) candidates.get(0);
            var content = (Map<?, ?>) candidate.get("content");
            var parts = (List<?>) content.get("parts");
            var part = (Map<?, ?>) parts.get(0);

            return part.get("text").toString();

        } catch (Exception e) {

            e.printStackTrace();

            return e.getMessage();
        }
    }

    public String summarize(String text) {

        String prompt =
                "다음 내용을 핵심만 한국어로 요약해줘.\n\n"
                        + text;

        return callGemini(prompt);
    }

    public List<Quiz> generateQuiz(String summary) {

        String prompt = """
    다음 요약을 보고 객관식 문제를 만들어.

    조건
    - 문제는 반드시 5개
    - 보기는 반드시 5개
    - answer는 정답 번호(1~5)
    - explanation도 작성
    - JSON 배열만 출력

    형식

    [
      {
        "question":"",
        "option1":"",
        "option2":"",
        "option3":"",
        "option4":"",
        "option5":"",
        "answer":1,
        "explanation":""
      }
    ]

    요약:

    """ + summary;

        return List.of();
    }
}
