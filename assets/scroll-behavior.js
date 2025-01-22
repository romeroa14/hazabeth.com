let lastScrollTop = 0;
const header = document.querySelector('.header-wrapper');
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  // Añadir efecto de transparencia
  if (currentScroll > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Ocultar/mostrar header con un pequeño delay
  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    requestAnimationFrame(() => {
      header.classList.add('hide-up');
    });
  } else {
    requestAnimationFrame(() => {
      header.classList.remove('hide-up');
    });
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true }); 