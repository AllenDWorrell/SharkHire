// Register page – new user registration form
import { useState } from 'react';

//Importing the CSS file for styling the register pag
import './Register.css';

//Function to handle the registration form (name, email, nNumber, password, confirmPassword, role)
function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nNumber: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  //Updates form data when a user types in the registration fields.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Submits the registration form
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call authService.register(formData) and redirect on success
    console.log('Register submitted:', formData);
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

        {/* Registration form capturing name, email, nNumber, password, confirmPassword, and role */}
        <form onSubmit={handleSubmit} className="register-form">

          {/* Full Name input field */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
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

          {/* N-Number input field */}
          <div className="form-group">
            <label htmlFor="nNumber">N#:</label>
            <input
              type="text"
              id="nNumber"
              name="nNumber"
              value={formData.nNumber}
              onChange={handleChange}
              placeholder="Enter your N-Number"
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
            <button type="submit" className="register-btn">
              Register
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