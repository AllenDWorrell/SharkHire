//JobCard.jsx
import { useState } from 'react';

//Services for API calls
import { createApplication, uploadResume } from '../services/api';

//Function component for individual job cards on the student dashboard. Displays job details and handles the application process when a student clicks "Apply".
function JobCard({ job }) {
  const { _id, title, type, location, hoursPerWeek, description, isOpen } = job || {};

  //State for managing the application form and submission process
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  //State for form fields. Initialized with empty strings or default values.
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
  
  //State for managing the uploaded resume file
  const [resume, setResume] = useState(null);

  //Handler for updating form field values in state when the user types into the form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Handler for when the user selects a file to upload as their resume. Stores the selected file in state.
  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  //Handler for when the user submits the application form. Validates that a resume has been uploaded, then uploads the resume file to GridFS and submits the application with the returned file ID and form data.
  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume.');
      return;
    }

    setError('');
    setSuccess('');
    setIsApplying(true);

    try {
      // Step 1: Upload the resume file to GridFS
      const fileData = new FormData();
      fileData.append('resume', resume);
      const uploadRes = await uploadResume(fileData);
      const { fileId, filename } = uploadRes.data;

      // Step 2: Submit the application with the returned file ID and all form fields
      await createApplication({
        job: _id,
        resumeId: fileId,
        resumeFilename: filename,
        ...formData,
      });

      setSuccess('Application submitted successfully!');
      setShowForm(false);
      setResume(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  //Render the job card with job details and conditionally render the application form when the user clicks "Apply". Also displays success or error messages based on the application submission outcome.
  return (
    <div className="job-card">
      <h3>{title}</h3>
      <span className="job-type">{type}</span>
      <p>{description}</p>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {isOpen === false ? (
        <p className="closed-notice">Applications are currently closed for this position.</p>
      ) : !showForm ? (
        <button className="apply-btn-main" onClick={() => setShowForm(true)}>Apply for this Position</button>
      ) : (
        <form onSubmit={handleApply} className="application-expanded-form">
          <h4>Job Application: {title}</h4>
          
          {/* Grid layout for the first three fields: Full Name, N#, and Major */}
          <div className="form-grid">
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} />
            <input type="text" name="nNumber" placeholder="N# (Student ID)" required onChange={handleChange} />
            <input type="text" name="major" placeholder="Major" required onChange={handleChange} />
          </div>

          <input type="text" name="address" placeholder="Local Address" required onChange={handleChange} />

          {/* NSU email field with validation pattern to ensure it ends with @nova.edu */}
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

          {/* Dropdown to ask if the student has already been offered the position, which is important for compliance with hiring policies. */}
          <div className="form-group">
            <label>Have you already been offered this position?</label>
            <select name="offeredPosition" required onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* If the student has already been offered the position, we can display a warning message about compliance with hiring policies. */}
          <div className="form-section">
            <label className="section-label">References</label>
            <input type="text" name="reference1" placeholder="Reference 1 (Name)" required onChange={handleChange} />
            <input type="email" name="reference1Email" placeholder="Reference 1 Email (e.g., reference1@example.com)" required onChange={handleChange} />
            <input type="text" name="reference2" placeholder="Reference 2 (Name)" required onChange={handleChange} />
            <input type="email" name="reference2Email" placeholder="Reference 2 Email (e.g., reference2@example.com)" required onChange={handleChange} />
          </div>

          {/* File input for uploading the resume, accepting only PDF and Word documents. This is a required field for submitting the application. */}
          <div className="form-section">
            <label className="section-label">Upload Resume (PDF or Word)</label>
            <input type="file" accept=".pdf,.doc,.docx" required onChange={handleFileChange} className="file-input" />
          </div>

          {/* Action buttons for submitting the application or canceling. The submit button is disabled while the application is being submitted to prevent duplicate submissions. */}
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