import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../services/authApi";
import "./PasswordReset.css";

function ResetPasswordPage() {
  const [params] = useSearchParams(); const navigate = useNavigate();
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (password !== confirm) return setMessage("비밀번호가 일치하지 않습니다.");
    setLoading(true); setMessage("");
    try { await resetPassword(params.get("token"), password); navigate("/login", { replace: true }); }
    catch (error) { setMessage(error.message); } finally { setLoading(false); }
  }
  return <main className="password-reset-page"><section className="password-reset-card">
    <h1>새 비밀번호 설정</h1><p>새로 사용할 비밀번호를 8자 이상 입력해 주세요.</p>
    <form onSubmit={submit}><label htmlFor="new-password">새 비밀번호</label><input id="new-password" type="password" minLength="8" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /><label htmlFor="confirm-password">비밀번호 확인</label><input id="confirm-password" type="password" minLength="8" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /><button disabled={loading || !params.get("token")}>{loading ? "변경 중..." : "비밀번호 변경"}</button></form>
    {message && <p role="alert" className="password-reset-card__message password-reset-card__message--error">{message}</p>}<Link to="/login">로그인으로 돌아가기</Link>
  </section></main>;
}
export default ResetPasswordPage;
