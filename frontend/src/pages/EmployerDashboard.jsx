// Employer Dashboard – main dashboard for employers to manage job postings and applications
import { useEffect, useState } from 'react';
import { createJob, getJobs, getApplications, updateApplicationStatus, deleteJob } from '../services/api';

// Importing the CSS file for styling the employer dashboard page.
import './EmployerDashboard.css';

// Importing placeholder icons
const IconPostJob = () => <span>➕ </span>;
const IconListings = () => <span>📝</span>;
const IconApplications = () => <span>📋</span>;
const IconPayroll = () => <span>💰</span>;
const IconGuidelines = () => <span>📘</span>;
const IconForms = () => <span>📑</span>;
const IconDownload = () => <span>⬇️ </span>;

function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('manage-applications');
  const [applications, setApplications] = useState([]); 
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState('');
  const [createJobSuccess, setCreateJobSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NSE',
    location: '',
    hoursPerWeek: 0,
  });

  useEffect(() => {
    loadEmployerData();
  }, []);

  const loadEmployerData = async () => {
    setIsLoadingJobs(true);
    setIsLoadingApps(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const jobsRes = await getJobs();
      const employerJobs = (jobsRes.data || []).filter(
        (job) => String(job.employer) === String(user.id)
      );
      setActiveJobs(employerJobs);

      const appsRes = await getApplications();
      const employerApps = (appsRes.data || []).filter(
        (app) => String(app.job?.employer) === String(user.id)
      );
      setApplications(employerApps);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setIsLoadingJobs(false);
      setIsLoadingApps(false);
    }
  };

  const handleApplicationAction = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(prev => 
        prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
      );
    } catch (err) {
      alert("Failed to update application status.");
    }
  };

  const handleCloseListing = async (jobId) => {
    if (window.confirm("Are you sure you want to close this listing? It will be removed from student view.")) {
      try {
        await deleteJob(jobId);
        setActiveJobs(prev => prev.filter(job => job._id !== jobId));
      } catch (err) {
        alert("Failed to close listing.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'hoursPerWeek' ? parseInt(value) : value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setCreateJobError('');
    setCreateJobSuccess('');
    setIsCreatingJob(true);

    try {
      const response = await createJob({ ...formData });
      setActiveJobs((prev) => [response.data, ...prev]);
      setCreateJobSuccess('Job listing created successfully.');
      setFormData({ title: '', description: '', type: 'NSE', location: '', hoursPerWeek: 0 });
      setActiveTab('my-listings');
    } catch (err) {
      setCreateJobError(err.response?.data?.message || 'Failed to create job listing.');
    } finally {
      setIsCreatingJob(false);
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
              <button className={`link-btn ${activeTab === 'post-job' ? 'active' : ''}`} onClick={() => setActiveTab('post-job')}>
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
          {/* Manage Student Applications Tab */}
          {activeTab === 'manage-applications' && (
            <div className="job-cards-list">
              {isLoadingApps ? <p>Loading applications...</p> : 
               applications.length === 0 ? <div className="no-results-msg">No new student applications to review.</div> : (
                applications.map(app => (
                  <div key={app._id} className="job-card">
                    <h3>{app.studentName || 'Student'} applying for {app.job?.title}</h3>
                    <p>Status: <strong>{app.status.toUpperCase()}</strong></p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Hiring Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <div className="resource-display">
              <h3 className="resource-header">Employer Hiring Guidelines</h3>
              <div className="handbook-content">
                <section><h4>1. Eligibility & Credit Hour Verification</h4><p>Students must maintain required enrollment.</p></section>
                <section><h4>2. Maximum Work Hours</h4><p>Maximum 20 hours per week during semesters.</p></section>
                <section><h4>3. SharkTime Approval</h4><p>Supervisors must approve timesheets.</p></section>
                <section><h4>4. Confidentiality & FERPA</h4><p>Maintain student data privacy.</p></section>
                <section><h4>5. Termination</h4><p>Notify employment office immediately.</p></section>
              </div>
            </div>
          )}

          {/* Forms Tab */}
          {activeTab === 'forms' && (
            <div className="resource-display">
              <h3 className="resource-header">Onboarding & Payroll Forms</h3>
              <div className="handbook-content">
                <div className="form-item-box">
                  <h4>Student Onboarding Packet</h4>
                  <div className="forms-download-container">
                    <a href="/SharkHire I9.pdf" download className="pdf-download-btn"><IconDownload /> I-9</a>
                    <a href="/SharkHire W4.pdf" download className="pdf-download-btn"><IconDownload /> W-4</a>
                    <a href="/SharkHire Direct Deposit.pdf" download className="pdf-download-btn"><IconDownload /> Direct Deposit</a>
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