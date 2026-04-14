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
const IconDownload = () => <span>📥</span>;

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
                  <tr><td>1</td><td>01/05/2026</td><td>01/18/2026</td><td>01/23/2026</td></tr>
                  <tr><td>2</td><td>01/19/2026</td><td>02/01/2026</td><td>02/06/2026</td></tr>
                  <tr><td>3</td><td>02/02/2026</td><td>02/15/2026</td><td>02/20/2026</td></tr>
                  <tr><td>4</td><td>02/16/2026</td><td>03/01/2026</td><td>03/06/2026</td></tr>
                  <tr><td>5</td><td>03/02/2026</td><td>03/15/2026</td><td>03/20/2026</td></tr>
                  <tr><td>6</td><td>03/16/2026</td><td>03/29/2026</td><td>04/03/2026</td></tr>
                  <tr><td>7</td><td>03/30/2026</td><td>04/12/2026</td><td>04/17/2026</td></tr>
                  <tr><td>8</td><td>04/13/2026</td><td>04/26/2026</td><td>04/30/2026</td></tr>
                  <tr><td>9</td><td>04/27/2026</td><td>05/10/2026</td><td>05/15/2026</td></tr>
                </tbody>
              </table>
              <p className="footer-note">*Please ensure all timesheets are approved by the Period End Date.</p>
            </div>
          )}

          {/* Direct Deposit View – matches the uploaded Authorization Form structure */}
          {activeView === 'deposit' && (
            <div className="resource-display">
              <h3 className="resource-header">Direct Deposit Setup</h3>
              <div className="download-container">
                <p>Please download, complete, and submit the Direct Deposit Authorization form to the Student Payroll office.</p>
                <a href="/SharkHire Direct Deposit.pdf" download="SharkHire_Direct_Deposit.pdf" className="pdf-download-btn">
                  <IconDownload /> Download SharkHire Direct Deposit Authorization.pdf
                </a>
              </div>
            </div>
          )}

          {/* Handbook and Forms Fallbacks */}
          {activeView === 'forms' && (
            <div className="resource-display">
               <h3 className="resource-header">Onboarding Forms & Resources</h3>
               <div className="forms-grid">
                  <div className="form-item">
                    <p>Employment Eligibility Verification</p>
                    <a href="/SharkHire I9.pdf" download="SharkHire_I9.pdf" className="pdf-download-btn">
                      <IconDownload /> Download SharkHire I-9.pdf
                    </a>
                  </div>
                  <div className="form-item" style={{ marginTop: '1.5rem' }}>
                    <p>Employee's Withholding Certificate</p>
                    <a href="/SharkHire W4.pdf" download="SharkHire_W4.pdf" className="pdf-download-btn">
                      <IconDownload /> Download SharkHire W-4.pdf
                    </a>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'handbook' && (
            <div className="resource-display">
              <h3 className="resource-header">Student Employee Guidelines</h3>
              
              <div className="handbook-content" style={{ color: '#333', lineHeight: '1.6' }}>
                <section style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#003087', marginBottom: '0.5rem' }}>1. Eligibility & Enrollment</h4>
                  <p>To maintain employment, students must be enrolled at least half-time (6 credits for undergraduates, 3 credits for graduates) during the fall and winter semesters.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#003087', marginBottom: '0.5rem' }}>2. Professionalism & Conduct</h4>
                  <p>Student employees are expected to represent NSU with integrity. This includes arriving on time, adhering to department-specific dress codes, and maintaining a high level of customer service.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#003087', marginBottom: '0.5rem' }}>3. Work Hours</h4>
                  <p>Students are permitted to work up to a maximum of 20 hours per week while classes are in session. During approved university breaks, students may work up to 37.5 hours per week with supervisor approval.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#003087', marginBottom: '0.5rem' }}>4. Confidentiality (FERPA)</h4>
                  <p>Many student roles involve access to sensitive information. All student employees must comply with FERPA regulations and maintain strict confidentiality regarding student records and university data.</p>
                </section>

                <section style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: '#003087', marginBottom: '0.5rem' }}>5. Payroll & Timesheets</h4>
                  <p>Hours must be logged accurately in the SharkTime system. Timesheets should be submitted by the end of each pay period to ensure timely payment according to the biweekly schedule.</p>
                </section>
              </div>

              <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <p><strong>Need more details?</strong> Contact the Office of Student Employment.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentDashboard;