import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-background"></div>
      <div className="about-content">
        <div className="main-section">
          <h1>Greetings,</h1>
          <p className="bio">
            I have always been creative. I will continue to be.
            You have found my coolection of stuff, like it love it hate it cringe 
            at it. Glad I could make you feelsomething. i love 
            comission works and general commadry so you better stay in touch.
          </p>
          <div className="signature">
            —Kip Drordy xx
          </div>
          <div className="contact">
            <div className="contact-item">
              <span className="icon">✉</span> flowinby@gmail.com
            </div>
            <div className="contact-item">
              <span className="icon">📸</span> @404notfound.doc
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

export default About;
