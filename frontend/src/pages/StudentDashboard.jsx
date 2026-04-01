//Student Dashboard – shows job listings and application statuses for a student
import { useState, useEffect } from 'react';

//Student Dashboard – shows job listings and application statuses for a student
import JobCard from '../components/JobCard';
import { getJobs } from '../services/api';

//Importing the CSS file for styling the student dashboard page.
import './StudentDashboard.css';

// Importing placeholder icons
const IconJobs = () => <span>🔍</span>;
const IconSearch = () => <span>🔍</span>;
const IconStatus = () => <span>📄</span>;
const IconHandbook = () => <span>📘</span>;
const IconPayroll = () => <span>💰</span>;
const IconDeposit = () => <span>🏦</span>;
const IconForms = () => <span>📑</span>;

// StudentDashboard component – main dashboard for students to view jobs and application statuses
function StudentDashboard() {
  const [activeView, setActiveView] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState('');
  const [filters, setFilters] = useState({
    fws: true,
    nse: true,
    location: 'All',
  });

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoadingJobs(true);
      setJobsError('');
      try {
        const response = await getJobs();
        setJobs(response.data || []);
      } catch (err) {
        setJobsError(err.response?.data?.message || 'Failed to load jobs. Please refresh and try again.');
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadJobs();
  }, []);

  // Logic to filter jobs based on checkbox selection
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = (filters.fws && job.type === 'FWS') || (filters.nse && job.type === 'NSE');
    const matchesLocation = filters.location === 'All' || job.location === filters.location;

    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="student-dashboard">
      {/*Welcome Header for students*/}
      <div className="welcome-section">
        <h1 className="greeting">Welcome to Your Dashboard!</h1>
        <p>Here you can browse available jobs, view your applications, and access resources.</p>
      </div>

      {/*Navigation tabs for switching between job listings and applications*/}
      <div className="portal-main">
        {/*Sidebar Navigation Pane*/}
        <aside className="sidebar-pane">
          
          {/*Box 1: Job Seekers*/}
          <div className="menu-card seeker-box">
            <h4><IconSearch/> Job Seekers</h4>
            <nav className="menu-links">
              <button 
                onClick={() => setActiveView('all')} 
                className={`link-btn ${activeView === 'all' ? 'active' : ''}`}
              >
                <IconJobs/> Find a Job
              </button>
            
              <button 
                onClick={() => setActiveView('applications')} 
                className={`link-btn ${activeView === 'applications' ? 'active' : ''}`}
              >
                <IconStatus/> My Applications
              </button>
            </nav>
          </div>

          {/*Box 2: Current Student Employees*/}
          <div className="menu-card employee-box">
            <h4><IconHandbook/> Current Student Employees</h4>
            <nav className="menu-links">
              <button onClick={() => setActiveView('handbook')} className="link-btn"><IconHandbook /> Student Employee Handbook</button>
              <button onClick={() => setActiveView('payroll')} className="link-btn"><IconPayroll /> Payroll Information</button>
              <button onClick={() => setActiveView('deposit')} className="link-btn"><IconDeposit /> Direct Deposit Setup</button>
              <button onClick={() => setActiveView('forms')} className="link-btn"><IconForms/> Forms & Resources</button>
            </nav>
          </div>
        </aside>

        {/* Focus Pane */}
        <section className="focus-pane">
          
          {/* Dynamic content area for sidebar selection */}
          {activeView === 'all' && (
            <div className="jobs-listings-view">
              <div className="search-filters-bar">
                <input type="search" placeholder="Quick Search Jobs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="filter-tags">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={filters.fws}
                      onChange={() => setFilters({ ...filters, fws: !filters.fws })}
                    />
                    FWS
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.nse}
                      onChange={() => setFilters({ ...filters, nse: !filters.nse })}
                    />
                    NSE
                  </label>
                  <label>
                    Location:
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    >
                      <option value="All">All</option>
                      <option value="Alvin Sherman Library">Alvin Sherman Library</option>
                      <option value="IT Department – Main Campus">IT Department – Main Campus</option>
                    </select>
                  </label>
                </div>
              </div>

              {/*Displaying live job cards loaded from backend.*/}
              <div className="job-cards-list" style={{ marginTop: '1.5rem' }}>
                {isLoadingJobs && <p className="no-results-msg">Loading jobs...</p>}
                {jobsError && <p className="no-results-msg">{jobsError}</p>}
                
                {!isLoadingJobs && !jobsError && filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))
                ) : null}

                {!isLoadingJobs && !jobsError && filteredJobs.length === 0 ? (
                  <p className="no-results-msg">No jobs match your selected filters.</p>
                ) : null}
              </div>
            </div>
          )}

          {activeView === 'applications' && (
            <div className="applications-view">
              {/* This container matches the "No jobs match" box from Find a Job */}
              <div className="no-results-msg">
                <p>You currently have 0 active applications.</p>
              </div>
            </div>
          )}

          {/* New views for Payroll and Deposit to make the sidebar functional */}
          {activeView === 'payroll' && (
            <div className="no-results-msg">
              <h3>2026 Payroll Schedule</h3>
              <p>Your payroll information will appear here once finalized.</p>
            </div>
          )}

          {activeView === 'deposit' && (
            <div className="no-results-msg">
              <h3>Direct Deposit Setup</h3>
              <p>Please follow the instructions in the handbook to set up your deposit.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;