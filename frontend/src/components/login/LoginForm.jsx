import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { loginUser } from "../../services/authApi";
import { saveLoginUser } from "../../services/session";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((previousData) => ({ ...previousData, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (isLoggingIn) return;
    if (formData.email.trim() === "") return setErrorMessage("이메일을 입력해 주세요.");
    if (formData.password.trim() === "") return setErrorMessage("비밀번호를 입력해 주세요.");

    setErrorMessage("");
    setIsLoggingIn(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      saveLoginUser(result, formData.email, rememberLogin);
      navigate("/home");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <section className="login-form">
      <div className="login-form__heading">
        <h2>로그인</h2>
        <p><strong>HWV</strong>와 함께 Java 학습을 이어가세요.</p>
      </div>
      <form onSubmit={handleSubmit} aria-busy={isLoggingIn}>
        <div className="login-form__field">
          <label htmlFor="email">이메일</label>
          <div className="login-form__input-wrap">
            <Mail aria-hidden="true" />
            <input id="email" name="email" type="email" value={formData.email} placeholder="이메일을 입력하세요" autoComplete="email" onChange={handleInputChange} disabled={isLoggingIn} />
          </div>
        </div>
        <div className="login-form__field">
          <label htmlFor="password">비밀번호</label>
          <div className="login-form__input-wrap">
            <LockKeyhole aria-hidden="true" />
            <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} placeholder="비밀번호를 입력하세요" autoComplete="current-password" onChange={handleInputChange} disabled={isLoggingIn} />
            <button className="login-form__password-toggle" type="button" onClick={() => setShowPassword((previous) => !previous)} aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}>{showPassword ? <EyeOff /> : <Eye />}</button>
          </div>
        </div>
        <div className="login-form__options">
          <label className="login-form__remember"><input type="checkbox" checked={rememberLogin} onChange={(event) => setRememberLogin(event.target.checked)} /><span>로그인 상태 유지</span></label>
          <button type="button" onClick={() => setErrorMessage("비밀번호 찾기 기능은 준비 중입니다.")}>비밀번호 찾기</button>
        </div>
        {errorMessage && <p className="login-form__error">{errorMessage}</p>}
        <button className="login-form__submit" type="submit" disabled={isLoggingIn}><span>{isLoggingIn ? "로그인 중..." : "로그인"}</span>{!isLoggingIn && <ArrowRight aria-hidden="true" />}</button>
      </form>
      <div className="login-form__signup"><i /><p>아직 계정이 없으신가요? <Link to="/signup">회원가입</Link></p><i /></div>
    </section>
  );
}

export default LoginForm;
