import { useState } from "react";
import { Link } from "react-router";
import { requestPasswordReset } from "../services/authApi";
import "./PasswordReset.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault(); setLoading(true); setMessage("");
    try {
      const result = await requestPasswordReset(email);
      setError(false); setMessage(result.message);
    } catch (requestError) {
      setError(true); setMessage(requestError.message);
    } finally { setLoading(false); }
  }

  return <main className="password-reset-page"><section className="password-reset-card">
    <h1>비밀번호 찾기</h1><p>가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.</p>
    <form onSubmit={submit}><label htmlFor="reset-email">이메일</label><input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /><button disabled={loading}>{loading ? "전송 중..." : "재설정 링크 받기"}</button></form>
    {message && <p role={error ? "alert" : "status"} className={`password-reset-card__message${error ? " password-reset-card__message--error" : ""}`}>{message}</p>}
    <Link to="/login">로그인으로 돌아가기</Link>
  </section></main>;
}
export default ForgotPasswordPage;
