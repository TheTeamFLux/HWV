import { requestApi } from "./api";

export async function loginUser(email, password) {
  return requestApi("/users/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function signupUser(userData) {
  return requestApi("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function requestPasswordReset(email) {
  return requestApi("/users/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, password) {
  return requestApi("/users/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
