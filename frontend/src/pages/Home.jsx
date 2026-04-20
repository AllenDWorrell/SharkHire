// Home page – landing page for SharkHire
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  // Array containing jobs that will be displayed in the dynamic bar
  const [featuredJobs, setFeaturedJobs] = useState([]);

  // Fetch featured jobs from backend API and store in state
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Replace with your actual API endpoint for job listings
        const response = await axios.get('http://localhost:5000/api/jobs');
        
        // Extract titles and limit to the most recent 5 for the ticker
        const titles = response.data.map(job => job.title);
        setFeaturedJobs(titles.slice(0, 5));
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
        // Fallback or empty state handling
        setFeaturedJobs([]);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="home-container">

      {/* Scrolling Text Section – Seamless Loop Implementation */}
      <div className="scrolling-title-container">
        <div className="scrolling-content">
          <h1 className="sharkhire-title">
            <i>Built by Sharks, for Sharks 🦈 &nbsp;&nbsp;</i>
          </h1>
          {/* Secondary hidden header to create the infinite scroll effect */}
          <h1 className="sharkhire-title" aria-hidden="true">
            <i>Built by Sharks, for Sharks 🦈 &nbsp;&nbsp;</i>
          </h1>
        </div>
      </div>

      <div className="hero">
        <p className="hero-subtitle">
          Your central hub for Nova Southeastern University student employment.
          Discover NSE and Federal Work-Study opportunities, apply, and track your progress.
        </p>
      </div>

      {/* Featured Jobs Bar – Now Dynamically Driven */}
      <div className="featured-jobs-container">
        <div className="featured-header">Featured Jobs</div>
        <div className="jobs-bar">
          {featuredJobs.length > 0 ? (
            <div className="ticker-wrapper">
              {featuredJobs.map((title, index) => (
                <span key={index} className="job-token">
                  {title} <span className="separator">•</span>
                </span>
              ))}
              {/* Duplicate the list for a seamless loop if the titles are many */}
              {featuredJobs.map((title, index) => (
                <span key={`dup-${index}`} className="job-token" aria-hidden="true">
                  {title} <span className="separator">•</span>
                </span>
              ))}
            </div>
          ) : (
            <span className="placeholder-text">New opportunities coming soon...</span>
          )}
        </div>
      </div>

      {/* Selection Cards - Students & Employers */}
      <div className="selection-cards">

        {/* Student Card */}
        <Link to="/login" className="selection-card-link">
          <div className="selection-card">
            <img src="/gradcap.png" alt="Students" className="card-icon" />
            <h2>Students</h2>
            <p>Explore job opportunities, apply, and manage your applications.</p>
          </div>
        </Link>

        {/* Employer Card */}
        <Link to="/login" className="selection-card-link">
          <div className="selection-card">
            <img src="/handshake.png" alt="Employers" className="card-icon" />
            <h2>Employers</h2>
            <p>Post job openings, review applications, and manage your workforce.</p>
          </div>
        </Link>

      </div>

      {/* Register Link */}
      <div className="home-actions">
        <Link to="/register" className="btn btn-primary get-started-btn">Get Started</Link>
      </div>

    </div>
  );
}

export default Home;