const SESSION_USER_KEY = "sumquiz-session-user";
const REGISTERED_USERS_KEY = "sumquiz-registered-users";
const USER_ID_KEY = "userId";
const USER_NAME_KEY = "userName";

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
    id: userFromResponse.userId,
    name:
      userFromResponse.name ||
      userFromResponse.username ||
      savedUser.name ||
      normalizedEmail.split("@")[0] ||
      "사용자",
    email: userFromResponse.email || savedUser.email || normalizedEmail,
  };

  if (user.id != null) {
    localStorage.setItem(USER_ID_KEY, String(user.id));
  }
  localStorage.setItem(USER_NAME_KEY, user.name);
  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  return user;
}

export function getSessionUser() {
  const sessionUser = readJson(SESSION_USER_KEY, null);

  if (sessionUser) {
    return sessionUser;
  }

  const userId = getUserId();
  const name = localStorage.getItem(USER_NAME_KEY);

  return userId || name ? { id: userId, name } : null;
}

export function getUserId() {
  return Number(localStorage.getItem(USER_ID_KEY));
}

export function isLoggedIn() {
  return getUserId() > 0;
}

export function clearSessionUser() {
  window.google?.accounts.id.disableAutoSelect();
  localStorage.removeItem(SESSION_USER_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}
