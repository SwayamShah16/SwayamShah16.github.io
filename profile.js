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
