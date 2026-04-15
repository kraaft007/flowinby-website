import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-left">
        <Link to="/" className="nav-logo">welcome to my world.</Link>
        <div className="nav-center-links">
          <Link to="/about">About Me</Link>
          <Link to="/experience">Experience</Link>
        </div>
      </div>
      <div className="nav-right">
        <Link to="/projects">projects</Link>
      </div>
    </nav>
  );
};

export default Navigation;
