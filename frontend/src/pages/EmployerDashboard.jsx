//Employer Dashboard - shows job listings and applications for an employer
import { useEffect, useState } from 'react';
import { createJob, getJobs } from '../services/api';

//Importing the CSS file for styling the employer dashboard page.
import './EmployerDashboard.css';

// Importing placeholder icons
const IconPostJob = () => <span>➕ </span>;
const IconListings = () => <span>📝</span>;
const IconApplications = () => <span>📋</span>;
const IconPayroll = () => <span>💰</span>;
const IconGuidelines = () => <span>📘</span>;

// Employer Dashboard – main dashboard for employers to manage job postings and applications
function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('manage-applications');
  const [applications] = useState([]); // Empty for "No results" test
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState('');
  const [createJobSuccess, setCreateJobSuccess] = useState('');

  // Added back state and handlers for the form to ensure it functions
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NSE',
    location: '',
    hoursPerWeek: 0,
  });

  useEffect(() => {
    const loadEmployerJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const response = await getJobs();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const employerJobs = (response.data || []).filter(
          (job) => String(job.employer) === String(user.id)
        );
        setActiveJobs(employerJobs);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadEmployerJobs();
  }, []);

  //Handles input changes for job posting form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'hoursPerWeek' ? parseInt(value) : value });
  };

  //Handles form submission for creating a new job listing
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setCreateJobError('');
    setCreateJobSuccess('');
    setIsCreatingJob(true);

    try {
      const response = await createJob({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        location: formData.location,
        hoursPerWeek: formData.hoursPerWeek,
      });

      setActiveJobs((prev) => [response.data, ...prev]);
      setCreateJobSuccess('Job listing created successfully.');
      setFormData({
        title: '',
        description: '',
        type: 'NSE',
        location: '',
        hoursPerWeek: 0,
      });
      setActiveTab('my-listings');
    } catch (err) {
      setCreateJobError(err.response?.data?.message || 'Failed to create job listing.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  return (
    <div className="employer-dashboard">
      {/*Welcome Header for employers*/}
      <section className="welcome-section">
        <h1 className="greeting">Welcome to Your Dashboard!</h1>
        <p>Manage your job postings and review student applications.</p>
      </section>

      {/* Main content area with sidebar and focus pane */}
      <div className="portal-main">
        {/* Sidebar pane */}
        <aside className="sidebar-pane">
          {/* Box 1: Job Management Menu */}
          <div className="menu-card">
            <h4>💼 Job Management</h4>
            <div className="menu-links">
              <button
                className={`link-btn ${activeTab === 'manage-applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('manage-applications')}
              >
                <IconApplications /> Manage Student Applications
              </button>
              <button
                className={`link-btn ${activeTab === 'post-job' ? 'active' : ''}`}
                onClick={() => setActiveTab('post-job')}
              >
                <IconPostJob /> Post a Job
              </button>
              <button
                className={`link-btn ${activeTab === 'my-listings' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-listings')}
              >
                <IconListings /> My Active Listings
              </button>
            </div>
          </div>

          {/* Box 2: Resources */}
          <div className="menu-card">
            <h4>📘 Resources</h4>
            <div className="menu-links">
              <button className="link-btn"><IconGuidelines /> Hiring Guidelines</button>
              <button className="link-btn"><IconPayroll /> Payroll Information</button>
            </div>
          </div>
        </aside>

        {/* FOCUS PANE */}
        <main className="focus-pane">
          {/* Manage Applications Tab */}
          {activeTab === 'manage-applications' && (
            <div className="no-results-msg">
              {applications.length === 0 ? (
                "No new student applications to review."
              ) : (
                "Application List Placeholder"
              )}
            </div>
          )}

          {/* My Active Listings Tab */}
          {activeTab === 'my-listings' && (
            <div className="no-results-msg">
              {isLoadingJobs ? (
                'Loading your job listings...'
              ) : activeJobs.length === 0 ? (
                "No active job listings yet. Post your first job to get started."
              ) : (
                <div>
                  {activeJobs.map((job) => (
                    <div key={job._id} style={{ marginBottom: '1rem', textAlign: 'left' }}>
                      <strong>{job.title}</strong>
                      <div>{job.type} | {job.location || 'Location TBD'} | {job.hoursPerWeek || 0} hrs/week</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Post a Job Tab */}
          {activeTab === 'post-job' && (
            <div className="menu-card">
              <h3 className="form-header">Post a New Job</h3>
              {createJobError && <div style={{ color: 'red', marginBottom: '10px' }}>{createJobError}</div>}
              {createJobSuccess && <div style={{ color: 'green', marginBottom: '10px' }}>{createJobSuccess}</div>}
              <form className="job-post-form" onSubmit={handleCreateJob}>
                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Library Assistant"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the responsibilities and requirements..."
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Job Type</label>
                    <select id="type" name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="NSE">NSE (Nova Student Employment)</option>
                      <option value="FWS">FWS (Federal Work-Study)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Main Campus"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="hoursPerWeek">Hours Per Week</label>
                    <input
                      type="number"
                      id="hoursPerWeek"
                      name="hoursPerWeek"
                      value={formData.hoursPerWeek}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-listing-btn" disabled={isCreatingJob}>
                    {isCreatingJob ? 'Creating...' : 'Create Listing'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EmployerDashboard;