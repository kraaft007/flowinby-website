import './Experience.css';

const Experience = () => {
  return (
    <div className="experience-page">
      <div className="experience-background"></div>
      <div className="experience-content">
        <h1>Experience</h1>
        <div className="experience-list">
          <div className="experience-item">
            <p className="description-top">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="experience-title">
              OCAD University — Illustration and Design
            </div>
            <p className="description-bottom">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
        <div className="tagline">
          the stuff of magic, the art of flowin by.
        </div>
      </div>
    </div>
  );
};

export default Experience;
