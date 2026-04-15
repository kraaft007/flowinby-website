import { Link, useNavigate } from 'react-router-dom';
import './ProjectsPt2.css';

const ProjectsPt2 = () => {
  const navigate = useNavigate();

  const projects = [
    { title: 'Arowwai University', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
    { title: 'Arowwai University', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
  ];

  return (
    <div className="projects-page pt2-page">
      <div className="projects-pt2-background"></div>
      <div className="projects-content">
        <div className="header-section">
          <h1>Projects <span>pt 2</span></h1>
          <Link to="/projects" className="rewind">rewind</Link>
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
          the stuff of magic, the art of flowin by.
        </div>
      </div>
    </div>
  );
};

export default ProjectsPt2;
