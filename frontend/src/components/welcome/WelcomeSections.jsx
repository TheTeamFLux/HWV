import {
  ArrowDown,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  FileUp,
  Flame,
  Play,
  Search,
  Sparkles,
} from "lucide-react";

const featureIcons = [Code2, Search, Sparkles, Play, BookOpenCheck, BarChart3];
const flowIcons = [FileUp, Search, Sparkles, Play, BarChart3];
const benefitIcons = [Code2, Sparkles, Play, BarChart3, BookOpenCheck, Flame];

function Logo({ className = "", decorative = false }) {
  return (
    <img
      className={className}
      src="/images/hwv-logo-cutout.png"
      alt={decorative ? "" : "HWV"}
      aria-hidden={decorative || undefined}
    />
  );
}

export function WelcomeHeroSection({ text }) {
  return (
    <section className="intro-hero" aria-labelledby="intro-hero-title">
      <div className="intro-hero__content intro-reveal is-visible">
        <Logo className="intro-hero__logo" />
        <p className="intro-hero__brand">HELP WITH VISION</p>
        <h1 id="intro-hero-title">
          {text.heroTitle}
          <span>{text.heroAccent}</span>
        </h1>
        <a className="intro-hero__scroll" href="#about">
          {text.scroll}
          <ArrowDown aria-hidden="true" size={17} />
        </a>
      </div>
    </section>
  );
}

export function WelcomeAboutSection({ text }) {
  return (
    <section className="intro-section intro-about" id="about" aria-labelledby="intro-about-title">
      <div className="intro-section__inner intro-about__layout">
        <div className="intro-about__copy intro-reveal">
          <p className="intro-section__eyebrow">{text.aboutEyebrow}</p>
          <h2 id="intro-about-title">{text.aboutTitle}</h2>
          <p>{text.aboutDescription}</p>
        </div>
        <div className="intro-about__features">
          {text.analysisFeatures.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <article
                className="intro-about__feature intro-reveal"
                style={{ "--reveal-delay": `${index * 55}ms` }}
                key={feature.title}
              >
                <span><Icon aria-hidden="true" size={20} strokeWidth={1.8} /></span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WelcomeFlowSection({ text }) {
  return (
    <section className="intro-section intro-flow" aria-labelledby="intro-flow-title">
      <div className="intro-section__inner">
        <div className="intro-section__heading intro-reveal">
          <p className="intro-section__eyebrow">{text.flowEyebrow}</p>
          <h2 id="intro-flow-title">{text.flowTitle}</h2>
          <p>{text.flowDescription}</p>
        </div>
        <ol className="intro-flow__timeline">
          {text.flowSteps.map((step, index) => {
            const Icon = flowIcons[index];
            return (
              <li
                className="intro-flow__step intro-reveal"
                style={{ "--reveal-delay": `${index * 80}ms` }}
                key={step.title}
              >
                <div className="intro-flow__icon">
                  <Icon aria-hidden="true" size={23} strokeWidth={1.8} />
                </div>
                <span className="intro-flow__number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function WelcomeBenefitsSection({ text }) {
  return (
    <section className="intro-section intro-benefits" aria-labelledby="intro-benefits-title">
      <div className="intro-section__inner">
        <div className="intro-section__heading intro-reveal">
          <p className="intro-section__eyebrow">{text.benefitEyebrow}</p>
          <h2 id="intro-benefits-title">{text.benefitTitle}</h2>
        </div>
        <div className="intro-benefits__grid">
          {text.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index];
            return (
              <article
                className="intro-benefits__card intro-reveal"
                style={{ "--reveal-delay": `${(index % 3) * 70}ms` }}
                key={benefit.title}
              >
                <span><Icon aria-hidden="true" size={24} strokeWidth={1.75} /></span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WelcomeAudienceSection({ text }) {
  return (
    <section className="intro-section intro-audience" aria-labelledby="intro-audience-title">
      <div className="intro-section__inner intro-audience__panel intro-reveal">
        <div>
          <p className="intro-section__eyebrow">{text.audienceEyebrow}</p>
          <h2 id="intro-audience-title">{text.audienceTitle}</h2>
        </div>
        <ul>
          {text.audiences.map((audience) => (
            <li key={audience}>
              <CheckCircle2 aria-hidden="true" size={20} strokeWidth={1.8} />
              <span>{audience}</span>
            </li>
          ))}
        </ul>
        <p className="intro-audience__statement">{text.audienceStatement}</p>
      </div>
    </section>
  );
}

export function WelcomeServerSection({ text, isReady, progress, onStart }) {
  return (
    <section className="intro-section intro-server" aria-labelledby="intro-server-title">
      <div className="intro-section__inner intro-server__panel intro-reveal">
        <Logo className="intro-server__logo" decorative />
        <p className="intro-section__eyebrow">{text.serverEyebrow}</p>
        <h2 id="intro-server-title">{text.serverTitle}</h2>
        <p className="intro-server__description">{text.serverDescription}</p>

        <div className="intro-server__status" aria-live="polite">
          <span className={isReady ? "is-ready" : "is-preparing"}><i /></span>
          <div>
            <small>{text.serverStatus}</small>
            <strong>{isReady ? text.ready : text.preparing}</strong>
          </div>
        </div>

        <div className="intro-server__progress">
          <div>
            <span>{isReady ? text.serverReady : text.preparingServer}</span>
            <b>{progress}%</b>
          </div>
          <div
            className="intro-server__track"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <button type="button" disabled={!isReady} onClick={onStart}>
          {isReady ? text.start : text.preparing}
        </button>
        <p className="intro-server__notice">{text.notice}</p>
      </div>
    </section>
  );
}
