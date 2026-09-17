// Layout fixes
// The page already loads this file from index.html. Keeping the fix here avoids
// relying on invalid inline declarations such as `align-items-center`.
const centeringStyles = document.createElement('style');
centeringStyles.textContent = `
  .hero-content {
    width: 100%;
    margin-inline: auto;
  }

  .hero-text {
    text-align: center;
  }

  .hero-text .description {
    margin-inline: auto;
  }

  .hero-buttons,
  .social-links {
    justify-content: center;
  }

  .skills-category h3 {
    text-align: center;
  }

  /* Keep the about-section icons in their own space so the animation cannot
     move them into the heading below. */
  .about-icon {
    animation: none;
    min-height: 3.5rem;
    align-items: center;
  }

  /* Center the final card when the three-column grid has an incomplete row. */
  .about-grid > .about-card:last-child {
    grid-column: 2;
  }

  @media (max-width: 900px) {
    .about-grid > .about-card:last-child {
      grid-column: 1 / -1;
      justify-self: center;
      width: min(100%, 500px);
    }
  }

  @media (max-width: 768px) {
    .hero-content {
      justify-items: center;
    }

    .about-grid > .about-card:last-child {
      grid-column: auto;
      width: 100%;
    }
  }
`;
document.head.appendChild(centeringStyles);
