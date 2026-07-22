import { FileUp, ListChecks, ScanSearch } from "lucide-react";
import { Link } from "react-router";

import LoginForm from "../components/login/LoginForm";
import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-page">
      <header className="login-page__header">
        <Link className="login-page__logo" to="/" aria-label="HWV 프로젝트 소개로 이동">
          <img src="/images/hwv-logo-cutout.png" alt="HWV" />
        </Link>
      </header>

      <main className="login-page__main">
        <section className="login-page__introduction">
          <p className="login-page__eyebrow">Start Java learning with HWV</p>
          <h1>내 Java 코드로 배우는<br /><span>맞춤형 문법 학습</span></h1>
          <p className="login-page__description">
            Java 파일을 업로드하면 AI가 코드의 핵심 문법을 분석하고
            <br />코드에 맞춘 퀴즈로 학습을 이어갈 수 있어요.
          </p>

          <div className="login-page__features">
            <div>
              <span className="login-page__feature-icon"><FileUp aria-hidden="true" /><b>1</b></span>
              <p><strong>파일 업로드</strong>Java 파일을 간편하게 등록하세요.</p>
            </div>
            <div>
              <span className="login-page__feature-icon"><ScanSearch aria-hidden="true" /><b>2</b></span>
              <p><strong>문법 분석</strong>AI가 코드의 핵심 문법을 분석해 드려요.</p>
            </div>
            <div>
              <span className="login-page__feature-icon"><ListChecks aria-hidden="true" /><b>3</b></span>
              <p><strong>맞춤 퀴즈</strong>분석 결과를 바탕으로 맞춤 퀴즈를 풀어요.</p>
            </div>
          </div>
        </section>

        <LoginForm />
      </main>

      <footer className="login-page__footer">
        <div><a href="#terms">이용약관</a><span /><a href="#privacy">개인정보처리방침</a></div>
        <p>© 2026 HWV. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
