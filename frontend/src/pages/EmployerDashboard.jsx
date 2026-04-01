// Employer Dashboard – allows employers to manage job listings and review applicants
import { useState, useEffect } from 'react';
import { getJobs, createJob, deleteJob } from '../services/api';

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NSE',
    location: '',
    hoursPerWeek: 0,
  });

  // Fetch employer's jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        // Filter to only show jobs created by this employer (in real implementation, backend would filter)
        setJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'hoursPerWeek' ? parseInt(value) : value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await createJob(formData);
      setJobs([response.data, ...jobs]);
      setFormData({ title: '', description: '', type: 'NSE', location: '', hoursPerWeek: 0 });
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <h2>Employer Dashboard</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Employer Dashboard</h2>
      <p>Manage your job postings and review student applications.</p>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Post New Job Button */}
      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem', padding: '8px 16px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        {showForm ? 'Cancel' : 'Post New Job'}
      </button>

      {/* Job Creation Form */}
      {showForm && (
        <form onSubmit={handleCreateJob} style={{ marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="title">Job Title: </label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Library Assistant" required />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description">Description: </label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Job description" required style={{ width: '100%', minHeight: '100px' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="type">Job Type: </label>
            <select id="type" name="type" value={formData.type} onChange={handleInputChange}>
              <option value="NSE">NSE (Nova Student Employment)</option>
              <option value="FWS">FWS (Federal Work-Study)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="location">Location: </label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Job location" />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="hoursPerWeek">Hours Per Week: </label>
            <input type="number" id="hoursPerWeek" name="hoursPerWeek" value={formData.hoursPerWeek} onChange={handleInputChange} min="0" />
          </div>

          <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Create Job
          </button>
        </form>
      )}

      {/* Job Listings */}
      <div style={{ marginTop: '1.5rem' }}>
        {jobs.length === 0 ? (
          <div style={{ padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
            <p style={{ color: '#888', textAlign: 'center' }}>No job listings yet. Post your first job to get started.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Type:</strong> {job.type} | <strong>Location:</strong> {job.location} | <strong>Hours/Week:</strong> {job.hoursPerWeek}</p>
              <p><strong>Status:</strong> {job.isOpen ? 'Open' : 'Closed'}</p>
              <button onClick={() => handleDeleteJob(job._id)} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
