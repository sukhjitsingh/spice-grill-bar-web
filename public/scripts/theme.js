const setMode = () => {
  const theme = localStorage.getItem('theme');
  const isDark =
    theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
};
setMode();
document.addEventListener('astro:after-swap', setMode);
