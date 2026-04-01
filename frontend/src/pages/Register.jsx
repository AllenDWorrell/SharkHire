// Register page – new user registration form
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

//Importing the CSS file for styling the register pag
import './Register.css';

//Function to handle the registration form (name, email, password, confirmPassword, role)
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //Updates form data when a user types in the registration fields.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  //Submits the registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to appropriate dashboard
      if (response.data.user.role === 'employer') {
        navigate('/employer-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  //Returns JSX layout for registration page
  return (
    //Centers register card on the page and applies styling from Register.css
    <div className="register-page">

      {/* Register card container with NSU logo, register form, and login link */}
      <div className="register-card">

        {/* NSU Logo at the top of the card */}
        <div className="register-logo">

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

        {/* Create Account heading centered below the logo */}
        <h2 className="register-title">Create Account</h2>

        {/* Error message display */}
        {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

        {/* Registration form capturing name, email, password, confirmPassword, and role */}
        <form onSubmit={handleSubmit} className="register-form">

          {/* Full Name input field */}
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* NSU email input field */}
          <div className="form-group">
            <label htmlFor="email">NSU Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your NSU email"
              required
            />
          </div>

          {/* Password input field */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
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

          {/* Confirm Password input field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Role selection dropdown */}
          <div className="form-group">
            <label htmlFor="role">I am a...</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* Register button centered */}
          <div className="register-btn-wrapper">
            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>

        </form>

        {/* Link to login page for users who already have an account */}
        <p className="login-link">
          Already have an account? <a href="/login">Login here.</a>
        </p>
      </div>
    </div>
  );
}

export default Register;