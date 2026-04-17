import React from 'react';
import './AboutUs.css';

const teamMembers = [
  {
    name: "Allen Worrell, Bry'Nice Berley, & Sarina Lotlikar",
    role: "Backend Developer | Frontend Developer | Database Developer",
    bio: "Our team brings together three passionate Computer Science students, each contributing specialized expertise to reimagine the student employment experience at NSU. Bry'Nice Berley, our front-end developer, leverages her hands-on experience in HTML, CSS, and JavaScript from her role at the Office of Innovation and Information Technology to craft an intuitive, frustration-free interface for every student. Sarina Pandurang Lotlikar, our database developer, draws on her background managing thousands of records across professional internships to build a secure, well-organized MongoDB database that keeps student and employer data running smoothly. Rounding out the team, Allen Worrell serves as back-end developer and brings real-world insight from his role as Webmaster for NSU's Mako Media Network, giving him a firsthand understanding of the student job search and employer workflows that power our platform.",
    // Ensure 'SharkHireGroup.png' is placed inside your 'public' folder
    image: "/SharkHireGroup.png"
  }
];

function AboutUs() {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>Meet the SharkHire Team</h1>
        <p>Designing the future of campus recruitment at Nova Southeastern University.</p>
      </header>

      <div className="caption-section">
        <div className="caption">
          <h2>Our Mission</h2>
          <p>To create a seamless, user-friendly platform that connects NSU students with employment opportunities, fostering career growth and campus engagement.</p>
        </div>
      </div>

      <div className="team-grid single-member">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card group-card">
            <div className="group-image-container">
              <img src={member.image} alt="SharkHire Design Team" className="group-photo" />
            </div>
            <h3>{member.name}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-bio group-bio">{member.bio}</p>
            <p className="member-note">*Team members displayed left to right in photo.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;