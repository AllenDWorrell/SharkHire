import { useState } from 'react';
import { createApplication } from '../services/api';

function JobCard({ job }) {
  const { _id, title, type, location, hoursPerWeek, description } = job || {};
  
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    nsuEmail: '',
    nNumber: '',
    address: '',
    major: '',
    workedAtNSU: 'No',
    previousDept: '',
    offeredPosition: 'No',
    reference1: '',
    reference2: ''
  });
  
  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume.');
      return;
    }

    setError('');
    setSuccess('');
    setIsApplying(true);

    // Use FormData for file uploads
    const data = new FormData();
    data.append('jobId', _id);
    data.append('resume', resume);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await createApplication(data);
      setSuccess('Application submitted successfully!');
      setShowForm(false);
      setResume(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="job-card">
      <h3>{title}</h3>
      <span className="job-type">{type}</span>
      <p>{description}</p>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {!showForm ? (
        <button className="apply-btn-main" onClick={() => setShowForm(true)}>Apply for this Position</button>
      ) : (
        <form onSubmit={handleApply} className="application-expanded-form">
          <h4>Job Application: {title}</h4>
          
          <div className="form-grid">
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
            <input type="email" name="nsuEmail" placeholder="NSU Email" required onChange={handleChange} />
            <input type="text" name="nNumber" placeholder="N# (Student ID)" required onChange={handleChange} />
            <input type="text" name="major" placeholder="Major" required onChange={handleChange} />
          </div>

          <input type="text" name="address" placeholder="Local Address" required onChange={handleChange} />

          <div className="form-group">
            <label>Have you ever worked at NSU?</label>
            <select name="workedAtNSU" required onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {formData.workedAtNSU === 'Yes' && (
            <input type="text" name="previousDept" placeholder="Which department?" required onChange={handleChange} />
          )}

          <div className="form-group">
            <label>Have you already been offered this position?</label>
            <select name="offeredPosition" required onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="form-section">
            <label className="section-label">References</label>
            <input type="text" name="reference1" placeholder="Reference 1 (Name & Contact)" required onChange={handleChange} />
            <input type="text" name="reference2" placeholder="Reference 2 (Name & Contact)" required onChange={handleChange} />
          </div>

          <div className="form-section">
            <label className="section-label">Upload Resume (PDF or Word)</label>
            <input type="file" accept=".pdf,.doc,.docx" required onChange={handleFileChange} className="file-input" />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isApplying}>
              {isApplying ? 'Submitting...' : 'Submit Application'}
            </button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default JobCard;