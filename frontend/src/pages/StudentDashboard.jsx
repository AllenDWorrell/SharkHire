// Student Dashboard – shows job listings and application statuses for a student
import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { getJobs } from '../services/api';

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs();
        setJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <h2>Student Dashboard</h2>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <p>Browse available NSE and Federal Work-Study positions below.</p>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      {jobs.length === 0 ? (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
          <p style={{ color: '#888', textAlign: 'center' }}>No jobs available at the moment.</p>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem' }}>
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
