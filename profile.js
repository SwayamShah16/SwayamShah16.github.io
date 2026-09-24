// Small progressive enhancement for the brutalist preview.
const menu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');

if (menu && hamburger) {
  hamburger.setAttribute('aria-label', 'Toggle navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Keep the final About card aligned naturally at every breakpoint.
const lastAboutCard = document.querySelector('.about-grid > .about-card:last-child');
if (lastAboutCard) lastAboutCard.style.gridColumn = 'auto';

// Add the learning and achievements content to the preview without changing its
// existing HTML structure. This keeps the section available across both layouts.
const sectionStyles = document.createElement('style');
sectionStyles.textContent = `
  .learning, .awards { background: var(--paper); }
  .learning-grid, .awards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
  .learning-card, .award-card { position: relative; padding: 26px; border: var(--line); background: var(--paper); box-shadow: var(--shadow); }
  .learning-card::before, .award-card::before { content: ''; display: block; height: 8px; margin: -26px -26px 22px; background: var(--signal); }
  .learning-card:nth-child(2)::before, .award-card:nth-child(2)::before { background: var(--blue); }
  .learning-card:nth-child(3)::before, .award-card:nth-child(3)::before { background: var(--acid); }
  .learning-card:hover, .award-card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0 var(--ink); }
  .learning-icon, .award-icon { margin-bottom: 14px; color: var(--blue); font-size: 2rem; }
  .learning-badge, .award-label { display: inline-block; margin-bottom: 12px; padding: 5px 8px; border: 2px solid var(--ink); background: var(--acid); font-size: .75rem; font-weight: 900; text-transform: uppercase; }
  .learning-card h3, .award-card h3 { margin-bottom: 10px; font-size: 1.4rem; line-height: 1; text-transform: uppercase; }
  .learning-card p, .award-card p { color: var(--muted); font-weight: 600; }
  .learning-list { display: grid; gap: 6px; margin-top: 16px; padding-left: 18px; font-weight: 800; }
  .award-card .award-value { display: block; margin: 10px 0; color: var(--signal); font-size: 2.5rem; font-weight: 950; line-height: 1; }
`;
document.head.appendChild(sectionStyles);

const makeSection = (id, title, className, content) => {
  const section = document.createElement('section');
  section.id = id;
  section.className = className;
  section.innerHTML = `<div class="container"><h2 class="section-title">${title}</h2>${content}</div>`;
  return section;
};

const learningSection = makeSection('learning', 'Learning & In Progress', 'learning', `
  <div class="learning-grid">
    <article class="learning-card fade-in-on-scroll">
      <div class="learning-icon"><i class="fas fa-layer-group"></i></div>
      <span class="learning-badge">In Progress</span>
      <h3>System Design</h3>
      <p>Building a stronger foundation in scalable architecture, API design, caching, and database trade-offs.</p>
      <ul class="learning-list"><li>RESTful API patterns</li><li>High-level architecture</li><li>Database scaling</li></ul>
    </article>
    <article class="learning-card fade-in-on-scroll">
      <div class="learning-icon"><i class="fas fa-code-branch"></i></div>
      <span class="learning-badge">Currently Learning</span>
      <h3>Modern Full-Stack</h3>
      <p>Expanding frontend and backend skills with production-focused patterns and user-friendly interfaces.</p>
      <ul class="learning-list"><li>React concepts</li><li>API integration</li><li>Deployment workflows</li></ul>
    </article>
    <article class="learning-card fade-in-on-scroll">
      <div class="learning-icon"><i class="fas fa-brain"></i></div>
      <span class="learning-badge">Exploring</span>
      <h3>AI & Data Products</h3>
      <p>Exploring practical AI workflows, data-driven decisions, and useful automation for software products.</p>
      <ul class="learning-list"><li>LLM fundamentals</li><li>Prompt design</li><li>Analytics workflows</li></ul>
    </article>
  </div>
`);

const awardsSection = makeSection('awards', 'Awards & Achievements', 'awards', `
  <div class="awards-grid">
    <article class="award-card fade-in-on-scroll"><div class="award-icon"><i class="fas fa-folder-open"></i></div><span class="award-label">Portfolio Milestone</span><span class="award-value">30+</span><h3>Repositories</h3><p>Consistent hands-on practice across software development, data, and AI projects.</p></article>
    <article class="award-card fade-in-on-scroll"><div class="award-icon"><i class="fas fa-rocket"></i></div><span class="award-label">Project Milestone</span><span class="award-value">5+</span><h3>Major Projects</h3><p>Built practical full-stack, enterprise management, machine-learning, and analytics applications.</p></article>
    <article class="award-card fade-in-on-scroll"><div class="award-icon"><i class="fas fa-laptop-code"></i></div><span class="award-label">Skills Milestone</span><span class="award-value">40+</span><h3>Technologies</h3><p>Continuously growing across Java, JavaScript, Python, databases, cloud, and AI tooling.</p></article>
  </div>
`);

const projectsSection = document.querySelector('#projects');
if (projectsSection) {
  projectsSection.before(learningSection, awardsSection);
}

if (menu) {
  const contactLink = menu.querySelector('a[href="#contact"]');
  ['learning', 'awards'].forEach((id) => {
    if (!menu.querySelector(`a[href="#${id}"]`)) {
      const item = document.createElement('li');
      item.innerHTML = `<a href="#${id}" class="nav-link">${id === 'learning' ? 'Learning' : 'Awards'}</a>`;
      menu.insertBefore(item, contactLink || null);
    }
  });
}

document.querySelectorAll('.footer-section ul').forEach((list) => {
  if (!list.querySelector('a[href="#learning"]')) list.insertAdjacentHTML('beforeend', '<li><a href="#learning">Learning</a></li>');
  if (!list.querySelector('a[href="#awards"]')) list.insertAdjacentHTML('beforeend', '<li><a href="#awards">Awards</a></li>');
});
