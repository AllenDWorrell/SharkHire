// Navbar component – site-wide navigation bar
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import sharkFin from '../assets/sharkfin.png';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <img src={sharkFin} alt="SharkHire Home" className="navbar__logo"/>
        SharkHire 🦈
      </Link>
      <ul className="navbar__links">
        {/* Home link is now only visible if no user is logged in */}
        {!user && <li><Link to="/">Home</Link></li>}

        {/* About Us link - Always visible so users can view the design team */}
        <li><Link to="/about">About Us</Link></li>

        {/* Shows when user is logged in and has a specific role */}
        {user?.role === 'student' && <li><Link to="/student-dashboard">Dashboard</Link></li>}
        {user?.role === 'employer' && <li><Link to="/employer-dashboard">Dashboard</Link></li>}

        {user ? (
          <>
            <li><span style={{ color: '#333', fontWeight: '600' }}>Welcome, {user.name}!</span></li>
            <li>
              <button 
                onClick={handleLogout} 
                style={{ background: 'none', border: 'none', color: '#003087', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;