// Login page – student/employer authentication form
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

//Importing the CSS file for styling the login page.
import './Login.css';

//Function to handle the login form that capture users username and password.
//This data is submitted to the backend for authentication.
function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //Updates form data when a user types in the username or password fields.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
 
  //Submits the login form. On successful login, the user is redirected to appropriate dashboard.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(formData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect based on role
      if (response.data.user.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  //Returns JSX layout for login page
  return (
    //Centers login card on the page and applies styling from Login.css
    <div className="login-page">

      {/* Login card container with NSU logo, login form, and register link */}
      <div className="login-card">

        {/* NSU Logo at the top of the card */}
        <div className="login-logo">

          {/* Left side: NOVA SOUTHEASTERN UNIVERSITY text */}
          <div className="logo-text">
            <span>NOVA SOUTHEASTERN</span>
            <span>UNIVERSITY</span>
          </div>

          {/* Vertical blue divider between text and NSU initials */}
          <div className="logo-divider"></div>

          {/* Right side: NSU initials with Florida text below */}
          <div className="logo-nsu">
            <strong>NSU</strong>
            <span>Florida</span>
          </div>
        </div>

        {/* Login heading centered below the logo */}
        <h2 className="login-title">Login</h2>

        {/* Error message display */}
        {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

        {/* Login form capturing username and password */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email or Username: </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or username"
              required
            />
          </div>

          {/* Password input field - characters are hidden for security purposes */}
          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login button centered */}
          <div className="login-btn-wrapper">
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Link to registration page for users who don't have an account */}
        <p className="register-link">
          Don't have an account? <a href="/register">Create an account.</a>
        </p>
      </div> 
    </div>
  );
}

export default Login;