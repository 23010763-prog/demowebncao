import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [stories, setStories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [requestVersion, setRequestVersion] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const closeNavigation = () => {
    setNavOpen(false);
    setOptionsOpen(false);
  };

  useEffect(() => {
    let isCurrent = true;

    const loadStories = async () => {
      setStatus('loading');

      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Unable to load stories.');

        const data = await response.json();
        if (!Array.isArray(data.items)) throw new Error('Invalid story data.');

        if (isCurrent) {
          setStories(data.items);
          setStatus('success');
        }
      } catch {
        if (isCurrent) setStatus('error');
      }
    };

    loadStories();
    return () => {
      isCurrent = false;
    };
  }, [requestVersion]);

  return (
    <div className="site-shell">
      <header className={`site-header${navOpen ? ' site-header--open' : ''}`}>
        <a className="brand" href="#top" aria-label="Phenikaa, back to top" onClick={closeNavigation}>
          <span className="brand__mark">P</span>
          <span className="brand__name">PHENIKAA</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="site-navigation"
          aria-expanded={navOpen}
          onClick={() => {
            setNavOpen((isOpen) => !isOpen);
            setOptionsOpen(false);
          }}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="header-links" id="site-navigation">
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#top" onClick={closeNavigation}>Home</a>
            <a href="#stories" onClick={closeNavigation}>Link</a>
          </nav>
          <div className="nav-dropdown">
            <button
              className="options-toggle"
              type="button"
              aria-expanded={optionsOpen}
              aria-controls="options-menu"
              onClick={() => setOptionsOpen((isOpen) => !isOpen)}
            >
              Options <span className="options-caret" aria-hidden="true" />
            </button>
            <div className={`options-menu${optionsOpen ? ' options-menu--open' : ''}`} id="options-menu" role="menu" hidden={!optionsOpen}>
              <a href="#stories" role="menuitem" onClick={closeNavigation}>Latest stories</a>
              <a href="#stories" role="menuitem" onClick={closeNavigation}>Research</a>
              <a href="#footer" role="menuitem" onClick={closeNavigation}>Contact</a>
            </div>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__photo" role="img" aria-label="A tree-lined university campus" />
          <div className="hero__content">
            <p className="eyebrow"><span /> Phenikaa University · Hanoi</p>
            <h1 id="hero-title">Shape the future<br />with knowledge.</h1>
            <p className="hero__description">
              A place to think boldly, create with purpose, and connect with people ready to make a difference.
            </p>
            <a className="hero__button" href="#stories">Explore our stories <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero__caption">Ideas today. Impact tomorrow. <span>01 / 03</span></p>
        </section>

        <section className="stories" id="stories" aria-labelledby="stories-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow eyebrow--dark">Inside Phenikaa</p>
              <h2 id="stories-title">Stories worth sharing</h2>
            </div>
            <p className="section-heading__note">Ideas, people, and progress shaping what comes next.</p>
          </div>

          {status === 'loading' && <p className="notice" role="status">Loading stories...</p>}
          {status === 'error' && (
            <div className="notice notice--error" role="alert">
              <p>Stories could not be loaded. Please try again.</p>
              <button type="button" onClick={() => setRequestVersion((version) => version + 1)}>Try again</button>
            </div>
          )}
          {status === 'success' && stories.length === 0 && <p className="notice">No stories to show yet.</p>}
          {status === 'success' && stories.length > 0 && (
            <div className="story-grid">
              {stories.map((story, index) => (
                <article className="story" key={story.id}>
                  <div className="story__image-wrap">
                    <img className="story__image" src={story.image} alt={story.imageAlt} loading="lazy" />
                    <span className="story__number">0{index + 1}</span>
                  </div>
                  <div className="story__meta"><span>{story.category}</span><time>{story.date}</time></div>
                  <h3>{story.title}</h3>
                  <p>{story.summary}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <a className="brand brand--footer" href="#top">
          <span className="brand__mark">P</span>
          <span className="brand__name">PHENIKAA</span>
        </a>
        <p>Growing knowledge · Shaping tomorrow</p>
        <span className="footer__copyright">© 2026 Phenikaa University</span>
      </footer>
    </div>
  );
}

export default App;