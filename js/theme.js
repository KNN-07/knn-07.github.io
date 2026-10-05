// Apply the existing preference before first paint. Content never depends on storage.
(() => {
  let theme;
  try { theme = localStorage.getItem('theme'); } catch { /* Storage can be disabled. */ }
  document.documentElement.dataset.theme = theme === 'light' || theme === 'dark'
    ? theme
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
})();
