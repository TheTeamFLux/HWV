package com.example.backend.service;

import com.example.backend.dto.CodingProblemDraft;
import com.example.backend.dto.CodingReviewResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JavaCodeExecutionServiceTest {
    private final JavaCodeExecutionService executionService = new JavaCodeExecutionService();

    @Test
    void executesCorrectJavaSolution() {
        CodingReviewResponse response = executionService.execute(problem("4"), """
            public class Solution {
                public int solution(int number) {
                    return number * 2;
                }
            }
            """);

        assertEquals("passed", response.status());
        assertEquals("passed", response.tests().get(0).status());
    }

    @Test
    void reportsCompilationError() {
        CodingReviewResponse response = executionService.execute(problem("4"), """
            public class Solution {
                public int solution(int number) {
                    return missing;
                }
            }
            """);

        assertEquals("failed", response.status());
        assertTrue(response.improvement().contains("찾을 수 없습니다"));
    }

    @Test
    void reportsWrongAnswer() {
        CodingReviewResponse response = executionService.execute(problem("4"), """
            public class Solution {
                public int solution(int number) {
                    return number;
                }
            }
            """);

        assertEquals("failed", response.status());
        assertEquals("failed", response.tests().get(0).status());
    }

    @Test
    void stopsExecutionAfterTimeout() {
        CodingReviewResponse response = executionService.execute(problem("4"), """
            public class Solution {
                public int solution(int number) {
                    while (true) {
                    }
                }
            }
            """);

        assertEquals("failed", response.status());
        assertTrue(response.tests().get(0).reason().contains("3초"));
    }

    @Test
    void rejectsBlockedApi() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> executionService.execute(problem("4"), """
                public class Solution {
                    public int solution(int number) {
                        return System.getenv().size();
                    }
                }
                """));

        assertTrue(exception.getMessage().contains("접근 코드는 실행할 수 없습니다"));
    }

    @Test
    void rejectsSourceThatIsTooLong() {
        String source = "public class Solution { public int solution(int number) { return number; } }"
            + " ".repeat(50_001);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
            () -> executionService.execute(problem("4"), source));

        assertTrue(exception.getMessage().contains("50,000자 이하"));
    }

    @Test
    void stopsExecutionWhenOutputIsTooLarge() {
        CodingReviewResponse response = executionService.execute(problem("4"), """
            public class Solution {
                public int solution(int number) {
                    for (int index = 0; index < 40_000; index++) {
                        System.out.print('x');
                    }
                    return number * 2;
                }
            }
            """);

        assertEquals("failed", response.status());
        assertTrue(response.tests().get(0).reason().contains("32KB"));
    }

    private CodingProblemDraft problem(String expected) {
        return new CodingProblemDraft(
            "메서드 선언",
            "두 배 반환하기",
            "정수의 두 배를 반환합니다.",
            List.of("정수를 반환합니다."),
            "2",
            expected,
            "",
            "쉬움",
            "solution",
            "int",
            List.of("int"),
            List.of(new CodingProblemDraft.TestCase(1, "기본 케이스", "2", expected, List.of("2")))
        );
    }
}
