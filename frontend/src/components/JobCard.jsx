// JobCard component – displays a summary of a single job listing
import { useState } from 'react';
import { createApplication } from '../services/api';

function JobCard({ job }) {
  const { _id, title, type, location, hoursPerWeek, description } = job || {};
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleApply = async () => {
    setError('');
    setSuccess('');
    setIsApplying(true);

    try {
      await createApplication({
        job: _id,
        coverLetter: coverLetter.trim() || undefined,
      });
      setSuccess('Applied successfully!');
      setCoverLetter('');
      setShowCoverLetter(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="job-card">
      <h3>{title || 'Job Title'}</h3>
      {type && <span className="job-type">{type}</span>}
      <p>{description || 'No description provided.'}</p>
      {location && <p><strong>Location:</strong> {location}</p>}
      {hoursPerWeek && <p><strong>Hours/week:</strong> {hoursPerWeek}</p>}

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

      {!showCoverLetter ? (
        <button 
          onClick={() => setShowCoverLetter(true)} 
          style={{ marginTop: '10px', padding: '8px 16px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Apply
        </button>
      ) : (
        <div style={{ marginTop: '10px', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
          <textarea 
            value={coverLetter} 
            onChange={(e) => setCoverLetter(e.target.value)} 
            placeholder="Optional: Add a cover letter" 
            style={{ width: '100%', minHeight: '80px', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button 
            onClick={handleApply} 
            disabled={isApplying}
            style={{ marginRight: '10px', padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isApplying ? 'Submitting...' : 'Submit Application'}
          </button>
          <button 
            onClick={() => { setShowCoverLetter(false); setCoverLetter(''); setError(''); }} 
            style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default JobCard;
