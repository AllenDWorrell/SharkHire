// Home page – landing page for SharkHire
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="hero">
      <h1>SharkHire 🦈</h1>
      <p>
        Your central hub for Nova Southeastern University student employment.
        Discover NSE and Federal Work-Study opportunities, apply, and track your progress.
      </p>
      <Link to="/register" className="btn btn-primary">Get Started</Link>
      <Link to="/login" className="btn btn-secondary">Sign In</Link>
    </div>
  );
}

export default Home;
