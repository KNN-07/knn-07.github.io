// Progressive motion layer. The page is complete without it: if this module or
// anime.js fails to load, theme.js releases the intro and everything stays static.
import { animate, createTimeline, createDrawable, createMotionPath, stagger, utils } from 'https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.esm.min.js';

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ease = 'out(4)';

function playIntro() {
  const copy = '.intro-copy > :not(h1)';
  const aside = '.profile-aside > :not(.monogram)';
  utils.set(['.intro h1 .word', '.name-dot', copy, aside, '.monogram'], { opacity: 0 });
  // Releasing the CSS hold must happen after the inline hidden state is set, in the same frame.
  root.dataset.motion = 'ready';

  const rings = createDrawable('.monogram .ring');
  utils.set(rings, { draw: '0 0' });
  utils.set('.orbit-dot', { scale: 0 });

  createTimeline({ defaults: { ease } })
    .add('.intro .eyebrow', { opacity: [0, 1], y: [10, 0], duration: 600 }, 100)
    .add('.intro h1 .word', { opacity: [0, 1], y: ['0.45em', '0em'], duration: 1000, delay: stagger(90) }, 200)
    .add('.name-dot', { opacity: [0, 1], scale: [0, 1], duration: 700, ease: 'outBack(3)' }, 650)
    .add('.intro-copy > :not(h1, .eyebrow)', { opacity: [0, 1], y: [16, 0], duration: 800, delay: stagger(70) }, 550)
    .add('.monogram', { opacity: [0, 1], scale: [.92, 1], duration: 1100 }, 350)
    .add(rings, { draw: ['0 0', '0 1'], duration: 1600, delay: stagger(180), ease: 'inOut(3)' }, 500)
    .add('.orbit-dot', { scale: [0, 1], duration: 600, ease: 'outBack(3)' }, 1500)
    .add(aside, { opacity: [0, 1], x: [14, 0], duration: 700, delay: stagger(55) }, 700)
    .call(startOrbit, 1700);
}

function startOrbit() {
  const dot = document.querySelector('.orbit-dot');
  // The motion path supplies translateX/Y, so the dot's own centre moves to the origin.
  utils.set(dot, { cx: 0, cy: 0 });
  animate(dot, { ...createMotionPath('.orbit-path'), duration: 14000, ease: 'linear', loop: true });
}

// Reveal section content as it scrolls into view. Items already on screen, or tucked
// inside closed details (animated on toggle instead), are left alone.
function revealOnScroll() {
  const groups = [
    '.section-heading > *',
    '.section-intro, .lab-note, .research-status > *, .email-link, .social-links, .elsewhere',
    '.interest-list li',
    '.project',
    '.subheading, .timeline-entry, .additional-background',
    '.award-list li',
    '.writing-entry',
  ];
  const pending = new Set();
  for (const selector of groups) {
    for (const element of document.querySelectorAll(`.section :is(${selector})`)) {
      if (element.closest('details:not([open]) .detail-body')) continue;
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      utils.set(element, { opacity: 0, y: 22 });
      pending.add(element);
    }
  }

  const observer = new IntersectionObserver(entries => {
    const entering = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
    if (!entering.length) return;
    entering.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    for (const element of entering) observer.unobserve(element);
    animate(entering, { opacity: 1, y: 0, duration: 900, delay: stagger(60), ease });
  }, { rootMargin: '0px 0px -8% 0px' });
  for (const element of pending) observer.observe(element);
}

// A single underline that glides between navigation links.
function navigationIndicator() {
  const nav = document.querySelector('nav');
  const indicator = document.createElement('span');
  indicator.className = 'nav-indicator';
  indicator.setAttribute('aria-hidden', 'true');
  nav.append(indicator);
  nav.classList.add('has-indicator');

  let placed = false;
  function move() {
    const link = nav.querySelector('a[aria-current]');
    if (!link) return;
    const target = { x: link.offsetLeft, width: link.offsetWidth };
    if (placed) animate(indicator, { ...target, duration: 550, ease: 'out(3)' });
    else utils.set(indicator, target);
    placed = true;
  }
  move();
  document.addEventListener('sectionchange', move);
  window.addEventListener('resize', () => { placed = false; move(); });
  document.fonts?.ready.then(() => { placed = false; move(); });
}

function detailsReveal() {
  for (const details of document.querySelectorAll('details')) {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      const body = details.querySelector(':scope > .detail-body');
      animate(body, { opacity: [0, 1], y: [-8, 0], duration: 450, ease });
    });
  }
}

function themeToggleSpin() {
  document.querySelector('.theme-toggle').addEventListener('click', event => {
    const icon = event.currentTarget.querySelector(root.dataset.theme === 'dark' ? '.sun' : '.moon');
    animate(icon, { rotate: [-120, 0], scale: [.4, 1], duration: 650, ease: 'outBack(2)' });
  });
}

if (reducedMotion.matches) {
  delete root.dataset.motion;
} else {
  if (root.dataset.motion === 'pending') playIntro();
  else startOrbit();
  revealOnScroll();
  navigationIndicator();
  detailsReveal();
  themeToggleSpin();
}
