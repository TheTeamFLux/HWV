import { loginUser, loginWithGoogle } from "../../services/authApi";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import Button from "../common/Button";
import { saveLoginUser } from "../../services/session";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberLogin: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return undefined;

    let attempts = 0;
    const initializeGoogleButton = () => {
      if (!window.google?.accounts.id || !googleButtonRef.current) {
        attempts += 1;
        if (attempts >= 100) {
          window.clearInterval(timerId);
          setErrorMessage("Google 로그인 버튼을 불러오지 못했습니다.");
        }
        return;
      }

      window.clearInterval(timerId);
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            setIsLoggingIn(true);
            setErrorMessage("");
            const result = await loginWithGoogle(response.credential);
            saveLoginUser(result, result.email);
            navigate("/home");
          } catch (error) {
            setErrorMessage(
              error.message || "Google 로그인에 실패했습니다. 다시 시도해 주세요.",
            );
          } finally {
            setIsLoggingIn(false);
          }
        },
      });
      googleButtonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "signin_with",
        width: 330,
      });
    };

    const timerId = window.setInterval(initializeGoogleButton, 100);
    initializeGoogleButton();
    return () => window.clearInterval(timerId);
  }, [navigate]);

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoggingIn) {
      return;
    }

    console.log("로그인 버튼 클릭됨");

    if (formData.email.trim() === "") {
      setErrorMessage("이메일을 입력해 주세요.");
      return;
    }

    if (formData.password.trim() === "") {
      setErrorMessage("비밀번호를 입력해 주세요.");
      return;
    }

    setErrorMessage("");
    setIsLoggingIn(true);

    try {
      const result = await loginUser(formData.email, formData.password);

      console.log("로그인 성공", result);

      saveLoginUser(result, formData.email);

      navigate("/home");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.message || "로그인 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <section className="login-form">
      <div className="login-form__heading">
        <h2>로그인</h2>

        <p>
          <strong>HWV</strong>에 오신 것을 환영합니다!
        </p>
      </div>

      <form onSubmit={handleSubmit} aria-busy={isLoggingIn}>
        <div className="login-form__field">
          <label htmlFor="email">이메일</label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            onChange={handleInputChange}
            disabled={isLoggingIn}
          />
        </div>

        <div className="login-form__field">
          <label htmlFor="password">비밀번호</label>

          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            onChange={handleInputChange}
            disabled={isLoggingIn}
          />
        </div>

        {errorMessage && <p className="login-form__error">{errorMessage}</p>}

        <div className="login-form__options">
          <label className="login-form__remember">
            <input
              name="rememberLogin"
              type="checkbox"
              checked={formData.rememberLogin}
              onChange={handleInputChange}
              disabled={isLoggingIn}
            />

            <span>로그인 상태 유지</span>
          </label>

          <Link to="/find-password">비밀번호 찾기</Link>
        </div>

        <Button type="submit" fullWidth disabled={isLoggingIn}>
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <div className="login-form__divider">
        <span>또는</span>
      </div>

      <div className="login-form__google" ref={googleButtonRef}>
        {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <span>Google 로그인 설정이 필요합니다.</span>
        )}
      </div>

      <p className="login-form__signup">
        아직 계정이 없으신가요?
        <Link to="/signup"> 회원가입</Link>
      </p>
    </section>
  );
}

export default LoginForm;
