const themeButton = document.querySelector('.theme-toggle');
const root = document.documentElement;

function updateThemeButton() {
  themeButton.setAttribute('aria-label', `Switch to ${root.dataset.theme === 'dark' ? 'light' : 'dark'} theme`);
}
updateThemeButton();
themeButton.hidden = false;
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch { /* Keep the in-memory preference. */ }
  updateThemeButton();
});

const navigationLinks = [...document.querySelectorAll('nav a')];
const sections = navigationLinks.map(link => document.querySelector(link.hash));

// Native anchors handle navigation, deep links, and history even without JavaScript.
// Only the visual current-section indicator needs scroll tracking.
let currentSection = null;
function updateCurrentSection() {
  const offset = document.querySelector('.site-header').offsetHeight + 45;
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= offset) current = section;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = sections[sections.length - 1];
  }
  if (current === currentSection) return;
  currentSection = current;
  for (const link of navigationLinks) {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  document.dispatchEvent(new CustomEvent('sectionchange'));
}
let scheduled = false;
function scheduleNavigationUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    updateCurrentSection();
    scheduled = false;
  });
}
window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate);
window.addEventListener('pageshow', scheduleNavigationUpdate);
updateCurrentSection();
