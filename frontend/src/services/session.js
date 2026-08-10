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

function removeLoginData(storage) {
  storage.removeItem(SESSION_USER_KEY);
  storage.removeItem(USER_ID_KEY);
  storage.removeItem(USER_NAME_KEY);
}

function findLoginStorage() {
  if (localStorage.getItem(SESSION_USER_KEY) || localStorage.getItem(USER_ID_KEY)) return localStorage;
  return sessionStorage;
}

export function saveLoginUser(loginResult, email, rememberLogin = false) {
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

  const storage = rememberLogin ? localStorage : sessionStorage;
  removeLoginData(localStorage);
  removeLoginData(sessionStorage);
  if (user.id != null) storage.setItem(USER_ID_KEY, String(user.id));
  storage.setItem(USER_NAME_KEY, user.name);
  storage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  return user;
}

export function getSessionUser() {
  const storage = findLoginStorage();
  let sessionUser = null;
  try {
    sessionUser = JSON.parse(storage.getItem(SESSION_USER_KEY));
  } catch { /* fall back to the individual fields below */ }

  if (sessionUser) {
    return sessionUser;
  }

  const userId = getUserId();
  const name = storage.getItem(USER_NAME_KEY);

  return userId || name ? { id: userId, name } : null;
}

export function getUserId() {
  return Number(findLoginStorage().getItem(USER_ID_KEY));
}

export function hasRememberedLogin() {
  return Number(localStorage.getItem(USER_ID_KEY)) > 0;
}

export function isLoggedIn() {
  return getUserId() > 0;
}

export function clearSessionUser() {
  removeLoginData(localStorage);
  removeLoginData(sessionStorage);
}
