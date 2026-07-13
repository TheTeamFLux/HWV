import { requestApi } from "./api";

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