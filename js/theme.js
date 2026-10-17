// Apply the existing preference before first paint. Content never depends on storage.
(() => {
  const root = document.documentElement;
  let theme;
  try { theme = localStorage.getItem('theme'); } catch { /* Storage can be disabled. */ }
  root.dataset.theme = theme === 'light' || theme === 'dark'
    ? theme
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  // Hold the intro until js/motion.js animates it in. If anime.js never arrives,
  // drop the flag so the page simply renders as static content.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.dataset.motion = 'pending';
  setTimeout(() => { if (root.dataset.motion === 'pending') delete root.dataset.motion; }, 2500);
})();
