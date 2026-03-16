// JobCard component – displays a summary of a single job listing
function JobCard({ job }) {
  const { title, type, location, hoursPerWeek, description } = job || {};

  return (
    <div className="job-card">
      <h3>{title || 'Job Title'}</h3>
      {type && <span className="job-type">{type}</span>}
      <p>{description || 'No description provided.'}</p>
      {location && <p><strong>Location:</strong> {location}</p>}
      {hoursPerWeek && <p><strong>Hours/week:</strong> {hoursPerWeek}</p>}
    </div>
  );
}

export default JobCard;
