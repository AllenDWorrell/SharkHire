// Student Dashboard – shows job listings and application statuses for a student
import JobCard from '../components/JobCard';

// Placeholder data – replace with API call once backend is ready
const placeholderJobs = [
  {
    _id: '1',
    title: 'Library Assistant',
    type: 'NSE',
    location: 'Alvin Sherman Library',
    hoursPerWeek: 10,
    description: 'Assist library staff with shelving, check-ins, and patron support.',
  },
  {
    _id: '2',
    title: 'IT Help Desk Technician',
    type: 'FWS',
    location: 'IT Department – Main Campus',
    hoursPerWeek: 15,
    description: 'Provide first-level technical support to students and faculty.',
  },
];

function StudentDashboard() {
  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <p>Browse available NSE and Federal Work-Study positions below.</p>
      <div style={{ marginTop: '1.5rem' }}>
        {placeholderJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
