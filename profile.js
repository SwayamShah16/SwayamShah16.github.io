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

  @media (max-width: 768px) {
    .hero-content {
      justify-items: center;
    }
  }
`;
document.head.appendChild(centeringStyles);
