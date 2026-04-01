// Root component – sets up React Router and renders page components
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

function RoleProtectedRoute({ allowedRoles, children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'employer') {
      return <Navigate to="/employer-dashboard" replace />;
    }
    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={(
              <RoleProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </RoleProtectedRoute>
            )}
          />
          <Route
            path="/employer-dashboard"
            element={(
              <RoleProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </RoleProtectedRoute>
            )}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
