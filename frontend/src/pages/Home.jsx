// Home page – landing page for SharkHire
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

//Importing assets for the selection cards
import gradCap from '../assets/gradcap.png';
import handShake from '../assets/handshake.png';

//Functional component for the Home page
function Home() {
  //Array containing jobs that will be displayed in the dynamic bar
  const [featuredJobs, setFeaturedJobs] = useState([]);

  //Fetch featured jobs from backend API and store in state
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs?isOpen=true');
        setFeaturedJobs(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
        setFeaturedJobs([]);
      }
    };

    fetchJobs();
  }, []);

  //JSX for the Home page, including the scrolling text, featured jobs bar, selection cards, and register link
  return (
    <div className="home-container">

      {/* Scrolling Text Section – Seamless Loop Implementation */}
      <div className="scrolling-title-container">
        <div className="scrolling-content">
          <h1 className="sharkhire-title">
            <i>Built for Sharks, by Sharks 🦈 &nbsp;&nbsp;</i>
          </h1>
          {/* Secondary hidden header to create the infinite scroll effect */}
          <h1 className="sharkhire-title" aria-hidden="true">
            <i>Built for Sharks, by Sharks 🦈 &nbsp;&nbsp;</i>
          </h1>
        </div>
      </div>

      <div className="hero">
        <p className="hero-subtitle">
          Your central hub for Nova Southeastern University student employment.
          Discover NSE and Federal Work-Study opportunities, apply, and track your progress.
        </p>
      </div>

      {/* Featured Jobs Bar */}
      <div className="featured-jobs-container">
        <div className="featured-header">
          <span>⚡ Latest Opportunities</span>
        </div>
        <div className="jobs-card-strip">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <div key={job._id} className="featured-job-card">
                <span className={`featured-badge ${job.type === 'FWS' ? 'badge-fws' : 'badge-nse'}`}>
                  {job.type}
                </span>
                <h4 className="featured-job-title">{job.title}</h4>
                {job.location && (
                  <p className="featured-job-meta">📍 {job.location}</p>
                )}
                {job.hoursPerWeek > 0 && (
                  <p className="featured-job-meta">🕐 {job.hoursPerWeek} hrs/week</p>
                )}
                <Link to="/login" className="featured-apply-btn">View Job</Link>
              </div>
            ))
          ) : (
            <p className="placeholder-text">New opportunities coming soon...</p>
          )}
        </div>
      </div>

      {/* Selection Cards - Students & Employers */}
      <div className="selection-cards">

        {/* Student Card */}
        <Link to="/login" className="selection-card-link">
          <div className="selection-card">
            <img src={gradCap} alt="Students" className="card-icon" />
            <h2>Students</h2>
            <p>Explore job opportunities, apply, and manage your applications.</p>
          </div>
        </Link>

        {/* Employer Card */}
        <Link to="/login" className="selection-card-link">
          <div className="selection-card">
            <img src={handShake} alt="Employers" className="card-icon" />
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