const setMode = () => {
  const theme = localStorage.getItem('theme');
  document.documentElement.classList.toggle('dark', theme === 'dark');
};
setMode();
document.addEventListener('astro:after-swap', setMode);
