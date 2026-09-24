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

// Add the learning content to the preview without changing its existing HTML structure.
const sectionStyles = document.createElement('style');
sectionStyles.textContent = `
  .learning { background: var(--paper); }
  .learning-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
  .learning-card { position: relative; padding: 26px; border: var(--line); background: var(--paper); box-shadow: var(--shadow); }
  .learning-card::before { content: ''; display: block; height: 8px; margin: -26px -26px 22px; background: var(--signal); }
  .learning-card:nth-child(2)::before { background: var(--blue); }
  .learning-card:nth-child(3)::before { background: var(--acid); }
  .learning-card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0 var(--ink); }
  .learning-icon { margin-bottom: 14px; color: var(--blue); font-size: 2rem; }
  .learning-badge { display: inline-block; margin-bottom: 12px; padding: 5px 8px; border: 2px solid var(--ink); background: var(--acid); font-size: .75rem; font-weight: 900; text-transform: uppercase; }
  .learning-card h3 { margin-bottom: 10px; font-size: 1.4rem; line-height: 1; text-transform: uppercase; }
  .learning-card p { color: var(--muted); font-weight: 600; }
  .learning-list { display: grid; gap: 6px; margin-top: 16px; padding-left: 18px; font-weight: 800; }
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

const projectsSection = document.querySelector('#projects');
if (projectsSection) projectsSection.before(learningSection);

if (menu && !menu.querySelector('a[href="#learning"]')) {
  const contactLink = menu.querySelector('a[href="#contact"]');
  const item = document.createElement('li');
  item.innerHTML = '<a href="#learning" class="nav-link">Learning</a>';
  menu.insertBefore(item, contactLink || null);
}

document.querySelectorAll('.footer-section ul').forEach((list) => {
  if (!list.querySelector('a[href="#learning"]')) list.insertAdjacentHTML('beforeend', '<li><a href="#learning">Learning</a></li>');
});
