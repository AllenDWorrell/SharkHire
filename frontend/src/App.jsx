//Root component – sets up React Router and renders page components
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AboutUs from './pages/AboutUs';

//Function to get current user from localStorage, used for role-based route protection
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

//Function component to protect routes based on user role, redirecting to login if not authenticated or to appropriate dashboard if role doesn't match
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

//Function component for the main App, setting up the layout with Navbar, Routes for different pages, and Footer. Uses flexbox to ensure footer stays at the bottom of the page even if content is short.
function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Main content area where differennt pages will be rendered based on the route */}
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
          <Route
            path="/about"
            element={<AboutUs />}
          />
        </Routes>
      </main>

      {/* Footer will always be at the bottom of the page. */}
      <Footer />
    </div>
  );
}

export default App;