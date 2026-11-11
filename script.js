/* =====================================================
   AutoExpert Garage - Script principal (JavaScript vanilla)
   Funciones:
   1. Menú móvil responsive
   2. Cabecera que cambia al hacer scroll
   3. Animaciones de aparición con IntersectionObserver
   4. Enlaces de navegación con scroll suave y resaltado
   5. Validación básica del formulario de contacto
   6. Año actual en el pie de página
   ===================================================== */

(function () {
  'use strict';

  /* ---------- 1. Menú móvil ---------- */
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

  // Cierra el menú al pulsar un enlace o con la tecla Escape
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
  });

  /* ---------- 2. Cabecera con sombra al hacer scroll ---------- */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Aparición de elementos al hacer scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // Solo se anima una vez
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Navegadores antiguos: mostrar todo sin animación
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 4. Resaltar la sección activa en el menú ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---------- 5. Validación del formulario de contacto ---------- */
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = form.nombre;
    const email = form.email;
    let valid = true;

    // Limpia errores previos
    [nombre, email].forEach(input => input.classList.remove('invalid'));

    if (nombre.value.trim().length < 2) {
      nombre.classList.add('invalid');
      valid = false;
    }
    if (!isValidEmail(email.value)) {
      email.classList.add('invalid');
      valid = false;
    }

    if (!valid) {
      feedback.textContent = 'Revisa tu nombre y tu email, por favor.';
      feedback.classList.add('error');
      return;
    }

    // Demostración: no hay backend, se simula el envío
    feedback.classList.remove('error');
    feedback.textContent = '¡Gracias, ' + nombre.value.trim() + '! Hemos recibido tu solicitud y te contactaremos pronto.';
    form.reset();
  });

  // Quita el error en cuanto el usuario corrige el campo
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('invalid'));
  });

  /* ---------- 6. Año actual en el pie ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
