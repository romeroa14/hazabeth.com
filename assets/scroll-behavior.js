let lastScrollTop = 0;
const header = document.querySelector('.header-wrapper');
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY || document.documentElement.scrollTop;
  
  // Añadir efecto de transparencia
  if (currentScroll > 0) {
    console.log('currentScroll', currentScroll);
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Ocultar/mostrar header
  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    // Scrolling hacia abajo
    header.classList.add('hide-up');
  } else {
    // Scrolling hacia arriba
    header.classList.remove('hide-up');
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true }); 