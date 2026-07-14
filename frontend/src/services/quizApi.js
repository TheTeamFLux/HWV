import { requestApi } from "./api";
import { getUserId, isLoggedIn } from "./session";

export async function generateQuiz(summary) {
  if (!isLoggedIn()) {
    throw new Error("로그인 후 퀴즈를 생성해 주세요.");
  }

  return requestApi("/quiz", {
    method: "POST",
    body: JSON.stringify({
      summary,
      userId: getUserId(),
    }),
  });
}

export async function getQuiz(documentId) {
  return requestApi(`/api/quizzes/${documentId}`, {
    method: "GET",
  });
}

export async function submitQuizAnswer(quizId, answer) {
  return requestApi(`/api/quizzes/${quizId}/answer`, {
    method: "POST",

    body: JSON.stringify({
      answer,
    }),
  });
}

export async function getQuizResult(quizId) {
  return requestApi(`/api/quizzes/${quizId}/result`, {
    method: "GET",
  });
} //fixs
