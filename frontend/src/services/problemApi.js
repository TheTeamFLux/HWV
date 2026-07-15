import { getUserId } from "./session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sumquiz.onrender.com";

async function request(endpoint, options = {}) {
  const response = await fetch(API_BASE_URL + endpoint, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(result?.message || result?.error || result || "요청 처리 중 오류가 발생했습니다.");
  return result;
}

export function getProblems() {
  return request(`/api/problems?userId=${getUserId()}`);
}

export function getProblem(problemId) {
  return request(`/api/problems/${problemId}?userId=${getUserId()}`);
}

export function createProblemsFromAnalysis(analysis) {
  return request("/api/projects/problems", {
    method: "POST",
    body: JSON.stringify({ userId: getUserId(), code: analysis.sourceCode }),
  });
}

export function submitSolution({ problemId, sourceCode }) {
  return request("/api/submissions", {
    method: "POST",
    body: JSON.stringify({ userId: getUserId(), problemId, sourceCode }),
  });
}

export function getDashboardSummary() {
  return request(`/api/me/dashboard?userId=${getUserId()}`);
}

export function getWrongNotes() {
  return request(`/api/me/wrong-notes?userId=${getUserId()}`);
}

export function getLearningStatistics() {
  return request(`/api/me/statistics?userId=${getUserId()}`);
}
