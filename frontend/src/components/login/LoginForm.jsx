import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLanguage } from "../../i18n/LanguageContext";
import { loginUser } from "../../services/authApi";
import { saveLoginUser } from "../../services/session";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    if (!formData.email.trim()) return setErrorMessage(t("emailPlaceholder"));
    if (!formData.password.trim()) return setErrorMessage(t("passwordPlaceholder"));
    setErrorMessage(""); setIsLoggingIn(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      saveLoginUser(result, formData.email, rememberLogin);
      navigate("/home");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || t("retry"));
    } finally { setIsLoggingIn(false); }
  }

  return (
    <section className="login-form">
      <Sparkles className="login-form__sparkle" aria-hidden="true" />
      <div className="login-form__heading"><h2>{t("welcomeBack")}</h2><p>{t("loginContinue")}</p></div>
      <form onSubmit={handleSubmit} aria-busy={isLoggingIn}>
        <div className="login-form__field"><label htmlFor="email">{t("email")}</label><div className="login-form__input-wrap"><Mail aria-hidden="true" /><input id="email" name="email" type="email" value={formData.email} placeholder={t("emailPlaceholder")} autoComplete="email" onChange={handleInputChange} disabled={isLoggingIn} /></div></div>
        <div className="login-form__field"><label htmlFor="password">{t("password")}</label><div className="login-form__input-wrap"><LockKeyhole aria-hidden="true" /><input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} placeholder={t("passwordPlaceholder")} autoComplete="current-password" onChange={handleInputChange} disabled={isLoggingIn} /><button className="login-form__password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={t("password")}>{showPassword ? <EyeOff /> : <Eye />}</button></div></div>
        <div className="login-form__options"><label className="login-form__remember"><input type="checkbox" checked={rememberLogin} onChange={(event) => setRememberLogin(event.target.checked)} /><span>{t("remember")}</span></label></div>
        {errorMessage && <p className="login-form__error">{errorMessage}</p>}
        <button className="login-form__submit" type="submit" disabled={isLoggingIn}><span>{isLoggingIn ? t("loggingIn") : t("login")}</span>{!isLoggingIn && <ArrowRight />}</button>
      </form>
      <div className="login-form__signup"><i /><p>{t("noAccount")} <Link to="/signup">{t("signup")}</Link></p><i /></div>
    </section>
  );
}
export default LoginForm;
