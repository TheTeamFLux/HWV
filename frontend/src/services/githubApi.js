import { getUserId } from "./session";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sumquiz.onrender.com";
const GITHUB_TOKEN_KEY = "hwv-github-publish-token";

async function request(endpoint, options = {}) {
  const response = await fetch(API_BASE_URL + endpoint, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.error || "GitHub 요청을 처리하지 못했습니다.");
  return result;
}

export function getGitHubStatus() {
  return request(`/api/github/status?userId=${getUserId()}`);
}

export function connectGitHub(repositoryUrl) {
  return request("/api/github/connect", {
    method: "POST",
    body: JSON.stringify({ userId: getUserId(), repositoryUrl }),
  });
}

export function disconnectGitHub() {
  localStorage.removeItem(GITHUB_TOKEN_KEY);
  return request(`/api/github/connection?userId=${getUserId()}`, { method: "DELETE" });
}

export function publishSolutionToGitHub(submissionId) {
  return request("/api/github/publish", {
    method: "POST",
    body: JSON.stringify({ userId: getUserId(), submissionId, publishToken: localStorage.getItem(GITHUB_TOKEN_KEY) }),
  });
}

export function saveGitHubPublishToken(token) {
  if (token) localStorage.setItem(GITHUB_TOKEN_KEY, token);
}
