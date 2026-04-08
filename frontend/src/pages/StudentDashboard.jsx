//Student Dashboard – shows job listings and application statuses for a student
import { useState, useEffect } from 'react';

//Student Dashboard – shows job listings and application statuses for a student
import JobCard from '../components/JobCard';
// Added getApplications to the API imports
import { getJobs, getApplications } from '../services/api';

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
  
  // New state to hold the student's submitted applications
  const [myApplications, setMyApplications] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  const [filters, setFilters] = useState({
    fws: true,
    nse: true,
    location: 'All',
  });

  // Effect to load jobs on mount
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

  // New effect to load applications whenever the user switches to the 'applications' view
  useEffect(() => {
    if (activeView === 'applications') {
      const loadApps = async () => {
        setIsLoadingApps(true);
        try {
          const response = await getApplications();
          setMyApplications(response.data || []);
        } catch (err) {
          console.error("Failed to load applications", err);
        } finally {
          setIsLoadingApps(false);
        }
      };
      loadApps();
    }
  }, [activeView]);

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
              <button onClick={() => setActiveView('handbook')} className={`link-btn ${activeView === 'handbook' ? 'active' : ''}`}><IconHandbook /> Student Employee Handbook</button>
              <button onClick={() => setActiveView('payroll')} className={`link-btn ${activeView === 'payroll' ? 'active' : ''}`}><IconPayroll /> Payroll Information</button>
              <button onClick={() => setActiveView('deposit')} className={`link-btn ${activeView === 'deposit' ? 'active' : ''}`}><IconDeposit /> Direct Deposit Setup</button>
              <button onClick={() => setActiveView('forms')} className={`link-btn ${activeView === 'forms' ? 'active' : ''}`}><IconForms/> Forms & Resources</button>
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
              {isLoadingApps ? (
                <p className="no-results-msg">Loading your applications...</p>
              ) : myApplications.length === 0 ? (
                <div className="no-results-msg">
                  <p>You currently have 0 active applications.</p>
                </div>
              ) : (
                <div className="application-status-list">
                  {myApplications.map((app) => (
                    <div key={app._id} className="status-card">
                      <div className="status-info">
                        <h3>{app.job?.title || "Unknown Position"}</h3>
                        <p>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                        <p><strong>N#:</strong> {app.nNumber}</p>
                      </div>
                      {/* Visual indicator for Acceptance, Denial, or Pending status */}
                      <div className={`status-label ${app.status?.toLowerCase()}`}>
                        {app.status || 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payroll View – uses a table to match the uploaded Pay Period schedule */}
          {activeView === 'payroll' && (
            <div className="resource-display">
              <h3 className="resource-header">Winter 2026 Biweekly Pay Periods</h3>
              <table className="payroll-table">
                <thead>
                  <tr>
                    <th>Pay Period</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Pay Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>01/01/2026</td><td>01/10/2026</td><td>01/16/2026</td></tr>
                  <tr><td>2</td><td>01/11/2026</td><td>01/24/2026</td><td>01/30/2026</td></tr>
                  <tr><td>3</td><td>01/25/2026</td><td>02/07/2026</td><td>02/13/2026</td></tr>
                  <tr><td>4</td><td>02/08/2026</td><td>02/21/2026</td><td>02/27/2026</td></tr>
                  <tr><td>5</td><td>02/22/2026</td><td>03/07/2026</td><td>03/13/2026</td></tr>
                  <tr><td>6</td><td>03/08/2026</td><td>03/21/2026</td><td>03/27/2026</td></tr>
                  <tr><td>7</td><td>03/22/2026</td><td>04/04/2026</td><td>04/10/2026</td></tr>
                  <tr><td>8</td><td>04/05/2026</td><td>04/18/2026</td><td>04/24/2026</td></tr>
                  <tr><td>9</td><td>04/19/2026</td><td>05/02/2026</td><td>05/08/2026</td></tr>
                  <tr><td>10</td><td>05/03/2026</td><td>05/16/2026</td><td>05/22/2026</td></tr>
                </tbody>
              </table>
              <p className="footer-note">*Please ensure all timesheets are approved by the Period End Date.</p>
            </div>
          )}

          {/* Direct Deposit View – matches the uploaded Authorization Form structure */}
          {activeView === 'deposit' && (
            <div className="resource-display">
              <h3 className="resource-header">Direct Deposit Authorization Form</h3>
              <form className="deposit-form-layout">
                <section className="form-section">
                  <h5>Personal Information</h5>
                  <input type="text" placeholder="Full Name" className="form-input" />
                  <input type="text" placeholder="Address" className="form-input" />
                  <div className="input-row">
                    <input type="text" placeholder="City" />
                    <input type="text" placeholder="State" />
                    <input type="text" placeholder="Zip" />
                  </div>
                </section>

                <section className="form-section" style={{ marginTop: '1rem' }}>
                  <h5>Financial Institution Information</h5>
                  <input type="text" placeholder="Bank Name" className="form-input" />
                  <div className="input-row">
                    <input type="text" placeholder="Routing #" />
                    <input type="text" placeholder="Account #" />
                  </div>
                  <div className="account-type">
                    <label><input type="radio" name="accType" /> Checking</label>
                    <label style={{ marginLeft: '1rem' }}><input type="radio" name="accType" /> Savings</label>
                  </div>
                </section>
                <button type="button" className="apply-btn" style={{ marginTop: '1.5rem', width: '100%' }}>Submit Authorization</button>
              </form>
            </div>
          )}

          {/* Handbook and Forms Fallbacks */}
          {(activeView === 'handbook' || activeView === 'forms') && (
            <div className="no-results-msg">
              <h3>Resources Coming Soon</h3>
              <p>This module is currently being finalized for the next sprint.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;