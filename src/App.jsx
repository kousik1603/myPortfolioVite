import { useEffect, useState } from 'react';
import './App.css';

// Backend URL: Vercel/GitHub Actions-e VITE_API_URL set thakle seta use hobe,
// na thakle local development-er jonno localhost use hobe.
const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

function App() {
  const [profile, setProfile] = useState(null);
  const [formStatus, setFormStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load profile from the backend
  useEffect(() => {
    fetch(`${API_URL}/api/profile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load profile');
        }
        return response.json();
      })
      .then((data) => setProfile(data))
      .catch((error) => {
        console.error('Profile error:', error);
      });
  }, []);

  // Send contact form data to MongoDB through the backend
  async function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const website = formData.get('website'); // honeypot (bot trap)

    setFormStatus('');
    setIsSending(true);

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          website
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || 'Unable to send your message.'
        );
      }

      setFormStatus('Message sent successfully!');
      form.reset();
    } catch (error) {
      console.error('Contact form error:', error);

      if (error instanceof TypeError) {
        // Network error: server ghumiye thakte pare (Render free plan)
        setFormStatus(
          'Could not reach the server. It may be waking up, please try again in a minute.'
        );
      } else {
        setFormStatus(error.message);
      }
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="portfolio">
      <nav className="navbar">
        <a href="#home" className="logo">
          KD<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main>
        {/* Home */}
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">WELCOME TO MY PORTFOLIO</p>

            <h1>
              Hi, I'm <span>Kousik</span>
            </h1>

            {profile && (
              <div className="backend-profile">
                <p>Name: {profile.name}</p>
                <p>Role: {profile.role}</p>
                <p>
                  Skills: {profile.skills?.join(', ')}
                </p>
              </div>
            )}

            <h2>I'm a Future Web Developer</h2>

            <p className="intro">
              I am learning web development and building creative
              websites with HTML, CSS, JavaScript and React.
            </p>

            <a className="primary-btn" href="#projects">
              Explore My Work ↗
            </a>
          </div>

          <div className="avatar-wrapper">
            <div className="avatar">
              <svg
                viewBox="0 0 200 200"
                role="img"
                aria-label="Default profile avatar"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="100"
                  fill="#263b70"
                />
                <path
                  d="M35 200 Q38 145 100 145 Q162 145 165 200"
                  fill="#60a5fa"
                />
                <path
                  d="M65 145 L100 178 L135 145"
                  fill="#f8fafc"
                />
                <rect
                  x="86"
                  y="119"
                  width="28"
                  height="36"
                  rx="12"
                  fill="#d99a76"
                />
                <ellipse
                  cx="100"
                  cy="84"
                  rx="43"
                  ry="51"
                  fill="#edb18b"
                />
                <path
                  d="M57 83 Q48 30 100 29 Q153 30 143 86 L131 65 Q102 76 73 60 L63 91 Z"
                  fill="#202338"
                />
                <circle cx="84" cy="88" r="3.5" fill="#202338" />
                <circle cx="116" cy="88" r="3.5" fill="#202338" />
                <path
                  d="M88 109 Q100 119 112 109"
                  fill="none"
                  stroke="#9a5549"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="avatar-badge">✦</span>
          </div>
        </section>

        {/* About */}
        <section className="section" id="about">
          <p className="eyebrow">GET TO KNOW ME</p>
          <h2>About Me</h2>
          <p>
            Hello! I am Kousik. I enjoy learning new technologies
            and creating useful, beautiful websites. This portfolio
            is my first step towards becoming a web developer.
          </p>
        </section>

        {/* Skills */}
        <section className="section" id="skills">
          <p className="eyebrow">WHAT I AM LEARNING</p>
          <h2>My Skills</h2>
          <p className="section-description">
            Technologies I am learning to build modern websites.
          </p>

          <div className="skills-grid">
            <div className="skill-card">
              <div className="skill-icon">🌐</div>
              <h3>HTML</h3>
              <p>Building the structure of web pages.</p>
              <span>Learning</span>
            </div>

            <div className="skill-card">
              <div className="skill-icon">🎨</div>
              <h3>CSS</h3>
              <p>Creating attractive and responsive designs.</p>
              <span>Learning</span>
            </div>

            <div className="skill-card">
              <div className="skill-icon">⚡</div>
              <h3>JavaScript</h3>
              <p>Making websites interactive and dynamic.</p>
              <span>Learning</span>
            </div>

            <div className="skill-card">
              <div className="skill-icon">⚛️</div>
              <h3>React</h3>
              <p>Building reusable components and interfaces.</p>
              <span>Learning</span>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="section" id="projects">
          <p className="eyebrow">MY RECENT WORK</p>
          <h2>My Projects</h2>
          <p className="section-description">
            Here are some projects I am building and exploring.
          </p>

          <div className="projects-grid">
            <article className="project-card">
              <div className="project-visual portfolio-visual">
                <span>01</span>
                <strong>My Portfolio</strong>
              </div>
              <div className="project-content">
                <span className="project-category">
                  PERSONAL WEBSITE
                </span>
                <h3>Personal Portfolio</h3>
                <p>
                  A responsive website to introduce myself and
                  showcase my skills and work.
                </p>
                <div className="project-tags">
                  <span>React</span>
                  <span>CSS</span>
                </div>
                <a className="project-link" href="#home">
                  View Portfolio ↗
                </a>
              </div>
            </article>

            <article className="project-card">
              <div className="project-visual weather-visual">
                <span>02</span>
                <strong>☀️ Weather App</strong>
              </div>
              <div className="project-content">
                <span className="project-category">
                  WEB APPLICATION
                </span>
                <h3>Weather App</h3>
                <p>
                  A weather application concept for displaying
                  weather conditions and temperature.
                </p>
                <div className="project-tags">
                  <span>JavaScript</span>
                  <span>API</span>
                </div>
                <a className="project-link" href="#contact">
                  Discuss Project ↗
                </a>
              </div>
            </article>

            <article className="project-card">
              <div className="project-visual learning-visual">
                <span>03</span>
                <strong>Learning Lab</strong>
              </div>
              <div className="project-content">
                <span className="project-category">
                  PRACTICE PROJECT
                </span>
                <h3>Learning Projects</h3>
                <p>
                  Small coding experiments to practise programming
                  and improve my development skills.
                </p>
                <div className="project-tags">
                  <span>HTML</span>
                  <span>CSS</span>
                  <span>JavaScript</span>
                </div>
                <a className="project-link" href="#skills">
                  Explore Skills ↗
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Contact */}
        <section className="section contact" id="contact">
          <p className="eyebrow">LET'S CONNECT</p>
          <h2>Contact Me</h2>

          <p className="section-description">
            Have a question or project idea? Send me a message.
          </p>

          <form
            className="contact-form"
            onSubmit={handleContactSubmit}
          >
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Write your message..."
              maxLength={1000}
              required
            />

            {/* Honeypot: bot-er jonno, manush dekhbe na */}
            <input
              type="text"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
              style={{ display: 'none' }}
            />

            <button
              className="primary-btn"
              type="submit"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send Message ↗'}
            </button>

            {formStatus && <p role="status">{formStatus}</p>}
          </form>
        </section>
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} Kousik. Built with React.
        </p>
      </footer>
    </div>
  );
}

export default App;