import { Code2 } from "lucide-react";
import { Link } from "react-router";
import LanguageSelector from "../components/common/LanguageSelector";
import LoginForm from "../components/login/LoginForm";
import { useLanguage } from "../i18n/LanguageContext";
import "./LoginPage.css";

function LoginPage() {
  const { t } = useLanguage();
  return (
    <div className="login-page">
      <header className="login-page__header">
        <Link className="login-page__logo" to="/" aria-label="HWV"><img src="/images/hwv-logo-cutout.png" alt="HWV" /></Link>
        <LanguageSelector />
      </header>
      <main className="login-page__main">
        <section className="login-page__introduction">
          <img className="login-page__intro-logo" src="/images/hwv-logo-cutout.png" alt="HWV" />
          <p className="login-page__eyebrow">{t("javaPlatform")}</p>
          <h1>{t("learnWithCode")}<br /><span>{t("personalJava")}</span></h1>
          <p className="login-page__description">{t("steadyGrowth")}<br />{t("todayLearning")}</p>
          <div className="login-page__learning-visual" aria-hidden="true">
            <div className="login-page__code-card"><Code2 /><span /><span /><span /></div>
          </div>
          <div className="login-page__decoration-dots" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>
        </section>
        <LoginForm />
      </main>
      <footer className="login-page__footer"><div><a href="#terms">{t("terms")}</a><span /><a href="#privacy">{t("privacy")}</a></div><p>© 2026 HWV. All rights reserved.</p></footer>
    </div>
  );
}
export default LoginPage;
