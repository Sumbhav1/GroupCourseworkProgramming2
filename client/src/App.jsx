import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/login" />} />  {/* Redirect to login if visiting root */}

        {/* Accessible only if logged in AND settings not finished */}
        <Route element={<ProtectedRoute requireSettingsComplete={false} />}>
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Accessible only if logged in AND settings are finished */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


