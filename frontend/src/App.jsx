import { Navigate, Route, Routes } from "react-router";

import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/lab/DashboardPage";
import ProblemCreatePage from "./pages/lab/ProblemCreatePage";
import ProblemListPage from "./pages/lab/ProblemListPage";
import ProblemWorkspacePage from "./pages/lab/ProblemWorkspacePage";
import ProfilePage from "./pages/lab/ProfilePage";
import StatisticsPage from "./pages/lab/StatisticsPage";
import WrongNotesPage from "./pages/lab/WrongNotesPage";
import WelcomePage from "./pages/WelcomePage";
import { hasRememberedLogin } from "./services/session";

function App() {
  return (
    <Routes>
      <Route path="/" element={hasRememberedLogin() ? <Navigate to="/dashboard" replace /> : <WelcomePage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/login" element={hasRememberedLogin() ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<ProblemListPage />} />
        <Route path="/problems/new" element={<ProblemCreatePage />} />
        <Route path="/quiz" element={<Navigate to="/problems" replace />} />
        <Route
          path="/problems/:problemId"
          element={<ProblemWorkspacePage />}
        />
        <Route path="/wrong-notes" element={<WrongNotesPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
