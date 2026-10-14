import React, { useEffect, useState } from 'react';
import './App.css';

const storyColumns = [
  { key: 'title', label: 'Story' },
  { key: 'category', label: 'Category' },
  { key: 'date', label: 'Date' },
  { key: 'summary', label: 'Summary' }
];

function App() {
  const [stories, setStories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [requestVersion, setRequestVersion] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ key: null, direction: 'ascending' });
  const [page, setPage] = useState(1);

  const closeNavigation = () => {
    setNavOpen(false);
    setOptionsOpen(false);
  };

  const visibleStories = stories
    .filter((story) => storyColumns.every(({ key }) => (
      String(story[key] || '').toLocaleLowerCase().includes((filters[key] || '').trim().toLocaleLowerCase())
    )))
    .sort((first, second) => {
      if (!sort.key) return 0;

      const firstValue = String(first[sort.key] || '');
      const secondValue = String(second[sort.key] || '');
      const firstDate = sort.key === 'date' ? Date.parse(firstValue) : NaN;
      const secondDate = sort.key === 'date' ? Date.parse(secondValue) : NaN;
      const comparison = !Number.isNaN(firstDate) && !Number.isNaN(secondDate)
        ? firstDate - secondDate
        : firstValue.localeCompare(secondValue, undefined, { numeric: true, sensitivity: 'base' });

      return sort.direction === 'ascending' ? comparison : -comparison;
    });
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(visibleStories.length / pageSize));
  const pageStories = visibleStories.slice((page - 1) * pageSize, page * pageSize);

  const sortBy = (key) => {
    setSort((currentSort) => ({
      key,
      direction: currentSort.key === key && currentSort.direction === 'ascending' ? 'descending' : 'ascending'
    }));
    setPage(1);
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
            <div className="story-grid-wrap">
              <p className="grid-result-count" role="status">
                Showing {visibleStories.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, visibleStories.length)} of {visibleStories.length} stories
              </p>
              <div className="story-grid-scroll">
                <table className="story-grid">
                  <thead>
                    <tr>
                      {storyColumns.map(({ key, label }) => (
                        <th key={key} scope="col" aria-sort={sort.key === key ? sort.direction : 'none'}>
                          <button className="grid-sort" type="button" onClick={() => sortBy(key)}>
                            {label}
                            <span aria-hidden="true">
                              {sort.key === key ? (sort.direction === 'ascending' ? '↑' : '↓') : '↕'}
                            </span>
                          </button>
                        </th>
                      ))}
                    </tr>
                    <tr className="grid-filter-row">
                      {storyColumns.map(({ key, label }) => (
                        <th key={key} scope="col">
                          <input
                            type="search"
                            aria-label={`Filter by ${label}`}
                            placeholder={`Filter ${label.toLowerCase()}...`}
                            value={filters[key] || ''}
                            onChange={(event) => {
                              setFilters((currentFilters) => ({
                                ...currentFilters,
                                [key]: event.target.value
                              }));
                              setPage(1);
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageStories.map((story) => (
                      <tr key={story.id}>
                        <th className="grid-story-title" scope="row">
                          <div className="grid-story">
                            <img src={story.image} alt={story.imageAlt} loading="lazy" />
                            <span>{story.title}</span>
                          </div>
                        </th>
                        <td>{story.category}</td>
                        <td>{story.date}</td>
                        <td>{story.summary}</td>
                      </tr>
                    ))}
                    {visibleStories.length === 0 && (
                      <tr>
                        <td className="grid-empty" colSpan={storyColumns.length}>No stories match your filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <nav className="grid-pagination" aria-label="Story pages">
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page} of {pageCount}</span>
                <button
                  type="button"
                  onClick={() => setPage((currentPage) => Math.min(pageCount, currentPage + 1))}
                  disabled={page >= pageCount}
                >
                  Next
                </button>
              </nav>
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