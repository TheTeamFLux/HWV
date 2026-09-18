import { BarChart3, CircleUserRound, Home, LogOut, NotebookTabs, Plus, SquareCode } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

import LanguageSelector from "../components/common/LanguageSelector";
import { useLanguage } from "../i18n/LanguageContext";
import { getCurrentProblem } from "../services/problemApi";
import { clearSessionUser, getSessionUser } from "../services/session";
import "./AppLayout.css";

function AppLayout() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [currentProblem, setCurrentProblem] = useState(null);
  const user = getSessionUser();
  const displayName = user?.name || "User";
  const navigationItems = [
    { to: "/dashboard", label: t("dashboard"), icon: <Home /> },
    { to: "/problems", label: t("javaProblems"), icon: <SquareCode /> },
    { to: "/wrong-notes", label: t("wrongNotes"), icon: <NotebookTabs /> },
    { to: "/statistics", label: t("statistics"), icon: <BarChart3 /> },
    { to: "/profile", label: t("profile"), icon: <CircleUserRound /> },
  ];

  function handleLogout() {
    localStorage.removeItem("accessToken");
    clearSessionUser();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    let active = true;
    getCurrentProblem(language).then((problem) => {
      if (active) setCurrentProblem(problem?.id ? problem : null);
    }).catch(() => { if (active) setCurrentProblem(null); });
    return () => { active = false; };
  }, [language]);

  return (
    <div className="lab-shell">
      <header className="lab-header">
        <button type="button" className="lab-brand" onClick={() => navigate("/dashboard")} aria-label="HWV"><img src="/images/hwv-logo-cutout.png" alt="HWV" /></button>
        <div className="lab-header__actions">
          <LanguageSelector compact />
          <button type="button" className="lab-profile-button" onClick={() => navigate("/profile")} title={t("profile")}>
            <span className="lab-avatar">{displayName.slice(0, 1)}</span><span>{displayName}</span>
          </button>
          <button type="button" className="lab-logout-button" onClick={handleLogout} title={t("logout")} aria-label={t("logout")}>
            <LogOut aria-hidden="true" /><span>{t("logout")}</span>
          </button>
        </div>
      </header>
      <aside className="lab-sidebar">
        <button type="button" className="lab-create-button" onClick={() => navigate("/problems/new")}><Plus />{t("createProblem")}</button>
        <nav className="lab-sidebar__navigation">
          {navigationItems.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? "lab-sidebar__link lab-sidebar__link--active" : "lab-sidebar__link"}><span className="lab-sidebar__icon">{item.icon}</span>{item.label}</NavLink>)}
        </nav>
        {currentProblem && <div className="lab-progress-card"><span>{t("currentProgress")}</span><strong>{currentProblem.title}</strong><div className="lab-progress-card__track"><span style={{ width: `${currentProblem.progress}%` }} /></div><small>{currentProblem.progress}%</small></div>}
      </aside>
      <main className="lab-main"><Outlet /></main>
    </div>
  );
}

export default AppLayout;
