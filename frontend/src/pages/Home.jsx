// Home page – landing page for SharkHire
import { Link } from 'react-router-dom';

function Home() {
  //Array containing jobs that will be displayed in the dynamic bar
  //TODO: Fetch featured jobs from backend API and store in state
  const featuredJobs = [];

  return (
    <div className="home-container">

      {/* Text section */}
      <div className="hero">
        <h1 className="sharkhire-title">SharkHire🦈</h1>
        <p className="hero-subtitle">
          Your central hub for Nova Southeastern University student employment.
          Discover NSE and Federal Work-Study opportunities, apply, and track your progress.
        </p>
      </div>

      {/* Featured Jobs Bar */}
      <div className="featured-jobs-container">
        <div className="featured-header">Featured Jobs</div>
        <div className="jobs-bar">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job, index) => (
              <span key={index} className="job-token">{job}</span>
            ))
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