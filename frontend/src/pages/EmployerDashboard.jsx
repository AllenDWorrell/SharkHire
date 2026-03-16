// Employer Dashboard – allows employers to manage job listings and review applicants
function EmployerDashboard() {
  return (
    <div className="dashboard">
      <h2>Employer Dashboard</h2>
      <p>Manage your job postings and review student applications.</p>
      {/* TODO: Fetch employer's job listings from /api/jobs and render them */}
      {/* TODO: Add "Post New Job" button wired to POST /api/jobs */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px dashed #ccc' }}>
        <p style={{ color: '#888', textAlign: 'center' }}>No job listings yet. Post your first job to get started.</p>
      </div>
    </div>
  );
}

export default EmployerDashboard;
