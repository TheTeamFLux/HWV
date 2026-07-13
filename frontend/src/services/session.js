const SESSION_USER_KEY = "sumquiz-session-user";
const REGISTERED_USERS_KEY = "sumquiz-registered-users";

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function rememberRegisteredUser({ name, email }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readJson(REGISTERED_USERS_KEY, {});

  users[normalizedEmail] = {
    name: name.trim(),
    email: normalizedEmail,
  };

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export function saveLoginUser(loginResult, email) {
  const normalizedEmail = email.trim().toLowerCase();
  const registeredUsers = readJson(REGISTERED_USERS_KEY, {});
  const userFromResponse = loginResult?.user || loginResult || {};
  const savedUser = registeredUsers[normalizedEmail] || {};

  const user = {
    name:
      userFromResponse.name ||
      userFromResponse.username ||
      savedUser.name ||
      normalizedEmail.split("@")[0] ||
      "사용자",
    email: userFromResponse.email || savedUser.email || normalizedEmail,
  };

  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  return user;
}

export function getSessionUser() {
  return readJson(SESSION_USER_KEY, null);
}

export function clearSessionUser() {
  localStorage.removeItem(SESSION_USER_KEY);
}
