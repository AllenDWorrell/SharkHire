// Navbar component – site-wide navigation bar
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
        <img src="/sharkfin.png" alt="SharkHire Home" className="navbar__logo"/>
        SharkHire 🦈
      </Link>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        {!user && <li><Link to="/student-dashboard">Student</Link></li>}
        {!user && <li><Link to="/employer-dashboard">Employer</Link></li>}
        {user?.role === 'student' && <li><Link to="/student-dashboard">Student</Link></li>}
        {user?.role === 'employer' && <li><Link to="/employer-dashboard">Employer</Link></li>}
        {user ? (
          <>
            <li><span style={{ color: '#333' }}>Welcome, {user.name}!</span></li>
            <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button></li>
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
