// Employer Dashboard – main dashboard for employers to manage job postings and applications
import { useEffect, useState } from 'react';
import { createJob, getJobs, deleteJob, updateJob, getApplications, updateApplication, downloadResume } from '../services/api';

// Importing onboarding forms from assets
import i9Form from '../assets/SharkHire I9.pdf';
import w4Form from '../assets/SharkHire W4.pdf';
import directDeposit from '../assets/SharkHire Direct Deposit.pdf';

// Importing the CSS file for styling the employer dashboard page.
import './EmployerDashboard.css';

//Icons for the sidebar menu – using simple emojis for clarity and visual appeal
const IconPostJob = () => <span>➕ </span>;
const IconListings = () => <span>📝</span>;
const IconEye = () => <span>👁️</span>;
const IconApplications = () => <span>📋</span>;
const IconPayroll = () => <span>💰</span>;
const IconGuidelines = () => <span>📘</span>;
const IconForms = () => <span>📑</span>;
const IconDownload = () => <span>⬇️ </span>;
const IconTrash = () => <span>🗑️ </span>;
const IconEdit = () => <span>✏️ </span>;

function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('manage-applications');
  const [applications, setApplications] = useState([]);
  const [applicationsError, setApplicationsError] = useState('');
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [expandedApps, setExpandedApps] = useState({});

  const toggleExpand = (id) =>
    setExpandedApps((prev) => ({ ...prev, [id]: !prev[id] }));
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState('');
  const [createJobSuccess, setCreateJobSuccess] = useState('');

  // Track if we are editing an existing job
  const [editingJobId, setEditingJobId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NSE',
    location: '',
    hoursPerWeek: 0,
  });

  // Load employer's jobs and applications on mount
  useEffect(() => {
    loadEmployerJobs();
    loadApplications();
  }, []);

  // Clear messages after 4 seconds
  useEffect(() => {
    if (createJobSuccess || createJobError) {
      const timer = setTimeout(() => {
        setCreateJobSuccess('');
        setCreateJobError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [createJobSuccess, createJobError]);

  const loadApplications = async () => {
    setIsLoadingApplications(true);
    setApplicationsError('');
    try {
      const response = await getApplications();
      setApplications(response.data || []);
    } catch (err) {
      setApplicationsError(err.response?.data?.message || 'Failed to load applications. Is the server running?');
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplication(appId, { status: newStatus });
      // This prevents student email and other populated fields from being lost
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDownloadResume = async (fileId, filename) => {
    try {
      const response = await downloadResume(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'resume');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download resume.');
    }
  };

  const handleViewResume = async (fileId) => {
    try {
      const response = await downloadResume(fileId);
      // Create a blob from the response data specifically as a PDF
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      // Open the URL in a new browser tab
      window.open(fileURL, '_blank');
    } catch (err) {
      alert('Failed to view resume.');
    }
  };

  const loadEmployerJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await getJobs();
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const employerJobs = (response.data || []).filter(
        (job) => String(job.employer) === String(user.id)
      );
      setActiveJobs(employerJobs);
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'hoursPerWeek' ? parseInt(value) : value });
  };

  // Pre-fill form and switch to "Post a Job" tab for editing
  const startEditing = (job) => {
    setEditingJobId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      type: job.type,
      location: job.location,
      hoursPerWeek: job.hoursPerWeek,
    });
    setActiveTab('post-job');
  };

  // Toggle 'isClosed' status to hide from student search without deleting
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      const response = await updateJob(jobId, { isClosed: updatedStatus });
      setActiveJobs((prev) =>
        prev.map(j => j._id === jobId ? { ...j, isClosed: updatedStatus } : j)
      );
    } catch (err) {
      alert("Failed to update application status.");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setCreateJobError('');
    setCreateJobSuccess('');
    setIsCreatingJob(true);

    try {
      if (editingJobId) {
        // Update existing job logic
        const response = await updateJob(editingJobId, formData);
        setActiveJobs((prev) => prev.map(j => j._id === editingJobId ? response.data : j));
        setCreateJobSuccess('Job listing updated successfully!');
      } else {
        // Create new job logic
        const response = await createJob({ ...formData });
        setActiveJobs((prev) => [response.data, ...prev]);
        setCreateJobSuccess('Job listing created successfully.');
      }

      setFormData({ title: '', description: '', type: 'NSE', location: '', hoursPerWeek: 0 });
      setEditingJobId(null);
      // Brief delay to show success before switching back
      setTimeout(() => setActiveTab('my-listings'), 1200);
    } catch (err) {
      setCreateJobError(err.response?.data?.message || 'Failed to process job listing.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to remove this listing? It will no longer be visible to students.")) {
      try {
        await deleteJob(jobId);
        setActiveJobs((prev) => prev.filter(job => job._id !== jobId));
      } catch (err) {
        alert("Failed to remove job. Please try again.");
        console.error("Delete Error:", err);
      }
    }
  };

  return (
    <div className="employer-dashboard">
      <section className="welcome-section">
        <h1 className="greeting">Welcome to Your Dashboard!</h1>
        <p>Manage your job postings and review student applications.</p>
      </section>

      <div className="portal-main">
        <aside className="sidebar-pane">
          <div className="menu-card">
            <h4>💼 Job Management</h4>
            <div className="menu-links">
              <button className={`link-btn ${activeTab === 'manage-applications' ? 'active' : ''}`} onClick={() => setActiveTab('manage-applications')}>
                <IconApplications/> Manage Student Applications
              </button>
              <button className={`link-btn ${activeTab === 'post-job' ? 'active' : ''}`} onClick={() => { setActiveTab('post-job'); setEditingJobId(null); }}>
                <IconPostJob/> Post a Job
              </button>
              <button className={`link-btn ${activeTab === 'my-listings' ? 'active' : ''}`} onClick={() => setActiveTab('my-listings')}>
                <IconListings/> My Active Listings
              </button>
            </div>
          </div>

          <div className="menu-card">
            <h4>📘 Resources</h4>
            <div className="menu-links">
              <button className={`link-btn ${activeTab === 'guidelines' ? 'active' : ''}`} onClick={() => setActiveTab('guidelines')}>
                <IconGuidelines/> Hiring Guidelines
              </button>
              <button className={`link-btn ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => setActiveTab('payroll')}>
                <IconPayroll/> Payroll Information
              </button>
              <button className={`link-btn ${activeTab === 'forms' ? 'active' : ''}`} onClick={() => setActiveTab('forms')}>
                <IconForms/> Forms
              </button>
            </div>
          </div>
        </aside>

        <main className="focus-pane">
          {activeTab === 'manage-applications' && (
            <div className="job-cards-list">
              {isLoadingApplications ? (
                <div className="no-results-msg">Loading applications...</div>
              ) : applicationsError ? (
                <div className="no-results-msg" style={{ color: 'red' }}>{applicationsError}</div>
              ) : applications.length === 0 ? (
                <div className="no-results-msg">No student applications to review.</div>
              ) : (
                applications.map((app) => (
                  <div key={app._id} className="job-card">
                    <div className="job-card-header">
                      <h3>{app.fullName || app.student?.name || 'Student'}</h3>
                      {/* Status badge with dynamic color based on application status */}
                      <span className={`status-badge ${app.status?.toLowerCase()}`}>
                        {app.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="job-details-short">
                      {app.student?.email || app.email || '—'} &nbsp;<strong>{app.job?.title || '—'}</strong>
                    </p>

                    {expandedApps[app._id] && (
                      <div className="app-details">
                        <div className="app-details-grid">
                          <div><span className="detail-label">N#</span><span>{app.nNumber || '—'}</span></div>
                          <div><span className="detail-label">Major</span><span>{app.major || '—'}</span></div>
                          <div><span className="detail-label">Address</span><span>{app.address || '—'}</span></div>
                          <div><span className="detail-label">Worked at NSU</span><span>{app.workedAtNSU || '—'}</span></div>
                          {app.workedAtNSU === 'Yes' && (
                            <div><span className="detail-label">Previous Dept</span><span>{app.previousDept || '—'}</span></div>
                          )}
                          <div><span className="detail-label">Offered Position</span><span>{app.offeredPosition || '—'}</span></div>
                          <div><span className="detail-label">Reference 1</span><span>{app.reference1 || '—'}</span></div>
                          <div><span className="detail-label">Reference 2</span><span>{app.reference2 || '—'}</span></div>
                          <div><span className="detail-label">Reference 1 Email</span><span>{app.reference1Email || '—'}</span></div>
                          <div><span className="detail-label">Reference 2 Email</span><span>{app.reference2Email || '—'}</span></div>
                        </div>
                      </div>
                    )}

                    {/* All action buttons on one line — uniform NSU blue style */}
                    <div className="card-actions">
                      <button className="toggle-details-btn" onClick={() => toggleExpand(app._id)}>
                        {expandedApps[app._id] ? 'Hide Details' : 'View Details'}
                      </button>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {app.resumeId && (
                        <button
                          className="view-resume-btn"
                          onClick={() => handleViewResume(app.resumeId)}
                        >
                          <IconEye /> View Resume
                        </button>
                      )}
                      {app.resumeId && (
                        <button
                          className="download-resume-btn"
                          onClick={() => handleDownloadResume(app.resumeId, app.resumeFilename)}
                        >
                          <IconDownload /> Download Resume
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'my-listings' && (
            <div className="active-listings-container">
              {isLoadingJobs ? (
                <div className="no-results-msg">Loading your job listings...</div>
              ) : activeJobs.length === 0 ? (
                <div className="no-results-msg">No active job listings yet.</div>
              ) : (
                activeJobs.map((job) => (
                  <div key={job._id} className={`job-card ${job.isClosed ? 'status-closed' : ''}`}>
                    <div className="job-card-header">
                       <div className="title-group">
                         <h3>{job.title}</h3>
                         <span className="job-type">{job.type}</span>
                         {job.isClosed && <span className="closed-badge">Closed</span>}
                       </div>
                    </div>
                    <p className="job-details-short">{job.location} | {job.hoursPerWeek} hrs/week</p>

                    <div className="card-actions">
                      <button className="edit-btn" onClick={() => startEditing(job)}>
                        <IconEdit /> Modify
                      </button>

                      <button
                        className={`status-btn ${job.isClosed ? 'reopen' : 'close'}`}
                        onClick={() => handleToggleStatus(job._id, job.isClosed)}
                      >
                        {job.isClosed ? '🔓 Open Applications' : '🔒 Close Applications'}
                      </button>

                      <button className="remove-btn" onClick={() => handleDeleteJob(job._id)}>
                        <IconTrash /> Remove Listing
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'post-job' && (
            <div className="resource-display">
              <h3 className="resource-header">{editingJobId ? "Modify Job Listing" : "Post a New Job"}</h3>
              <form className="job-post-form" onSubmit={handleCreateJob}>
                <div className="form-group">
                  <label htmlFor="title">Job Title</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Student Technology Assistant" />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required placeholder="Detail the responsibilities and requirements..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                      <option value="NSE">NSE</option>
                      <option value="FWS">FWS</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Building/Room" />
                  </div>
                  <div className="form-group">
                    <label>Hours</label>
                    <input type="number" name="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleInputChange} />
                  </div>
                </div>
                <button type="submit" className="submit-listing-btn" disabled={isCreatingJob}>
                  {isCreatingJob ? 'Saving...' : editingJobId ? 'Update Listing' : 'Create Listing'}
                </button>
                {createJobSuccess && <p style={{color: 'green', marginTop: '10px'}}>{createJobSuccess}</p>}
                {createJobError && <p style={{color: 'red', marginTop: '10px'}}>{createJobError}</p>}
              </form>
            </div>
          )}

          {/* Guidelines section */}
          {activeTab === 'guidelines' && (
            <div className="resource-display">
              <h3 className="resource-header">Employer Hiring Guidelines</h3>
              <div className="handbook-content">
                <section>
                  <h4>1. Eligibility & Credit Hours</h4>
                  <p>Verify students maintain <strong>6 credits</strong> (undergrad) or <strong>3 credits</strong> (grad).</p>
                </section>
                <section>
                  <h4>2. Work Hour Limits</h4>
                  <p>Maximum <strong>20 hours per week</strong> during active semesters.</p>
                </section>
                <section>
                  <h4>3. SharkTime Approval</h4>
                  <p>Supervisors must approve timesheets biweekly by the period end date.</p>
                </section>
              </div>
            </div>
          )}

          {/* Payroll section */}
          {activeTab === 'payroll' && (
            <div className="resource-display">
              <h3 className="resource-header">Winter 2026 Pay Periods</h3>
              <table className="payroll-table">
                <thead>
                  <tr><th>Period</th><th>Start</th><th>End</th><th>Pay Date</th></tr>
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
            </div>
          )}

          {/* Forms section */}
          {activeTab === 'forms' && (
            <div className="resource-display">
              <h3 className="resource-header">Onboarding & Payroll Forms</h3>
              <div className="handbook-content">
                <div className="form-item-box">
                  <h4 className="form-box-title">New Hire Onboarding Packet</h4>
                  <p className="form-description">Download and complete these forms to enable student payroll setup.</p>
                  <div className="forms-download-container">
                    <a href={i9Form} download className="pdf-download-btn"><IconDownload /> I-9 Form</a>
                    <a href={w4Form} download className="pdf-download-btn"><IconDownload /> W-4 Form</a>
                    <a href={directDeposit} download className="pdf-download-btn"><IconDownload /> Direct Deposit</a>
                  </div>
                  <div className="form-notice">
                    <p><strong>Note:</strong> Students cannot start work until I-9 verification is complete.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EmployerDashboard;