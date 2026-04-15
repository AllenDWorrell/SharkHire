// Root component – sets up React Router and renders page components
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
    /* 2. Wrap in a div with flexbox to handle the sticky footer */
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* 3. flex: 1 ensures the main content area grows to fill space, pushing footer down */}
      <main style={{ flex: '1' }}>
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

      {/* 4. Footer sits at the very bottom */}
      <Footer />
    </div>
  );
}

export default App;