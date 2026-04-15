import { Link, useNavigate } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();

  const projects = [
    { title: 'Arowwai University', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { title: 'Arowwai University', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { title: 'Arowwai University', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
  ];

  return (
    <div className="projects-page">
      <div className="projects-background"></div>
      <div className="projects-content">
        <div className="header-section">
          <h1>Projects</h1>
          <Link to="/projects-2" className="rewind">rewind</Link>
        </div>
        
        <div className="projects-main">
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-title">{project.title}</div>
                <p className="project-description">{project.description}</p>
              </div>
            ))}
          </div>

          <div className="bonus-section">
            <div className="bonus-box">
              <h3>Bonus!</h3>
              <p>my thoughts, feelings, musings, ideas and speculations...</p>
              <p>wanna read em??</p>
              <button className="retro-button" onClick={() => navigate('/final')}>
                Yes
              </button>
            </div>
          </div>
        </div>

        <div className="tagline">
          wherever you go, there you are.
        </div>
      </div>
    </div>
  );
};

export default Projects;
