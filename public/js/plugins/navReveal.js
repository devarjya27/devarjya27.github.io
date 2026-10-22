(() => {
  const header = document.querySelector('.nier-nav');
  const revealZone = document.querySelector('.nav-reveal-zone');
  if (!header || !revealZone) return;

  let hideTimer = 0;

  const show = () => {
    window.clearTimeout(hideTimer);
    header.classList.add('is-visible');
    revealZone.setAttribute('aria-expanded', 'true');
  };

  const hide = () => {
    if (window.scrollY <= 8) return;
    if (header.matches(':hover') || header.contains(document.activeElement)) return;
    header.classList.remove('is-visible');
    revealZone.setAttribute('aria-expanded', 'false');
  };

  const scheduleHide = () => {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(hide, 260);
  };

  document.addEventListener('pointermove', event => {
    if (window.scrollY <= 8 || event.clientY <= 36) show();
    else if (event.clientY > header.offsetHeight + 24) scheduleHide();
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (window.scrollY <= 8) show();
    else scheduleHide();
    syncActiveSection();
  }, { passive: true });

  const syncActiveSection = () => {
    if (!document.querySelector('.portfolio-shell')) return;

    const links = [...header.querySelectorAll('nav [data-section]')];
    const marker = Math.min(window.innerHeight * 0.38, 320);
    let activeSection = 'home';

    links.forEach(link => {
      const section = document.getElementById(link.dataset.section);
      if (section && section.getBoundingClientRect().top <= marker) {
        activeSection = link.dataset.section;
      }
    });

    links.forEach(link => {
      const active = link.dataset.section === activeSection;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  revealZone.addEventListener('click', show);
  revealZone.addEventListener('focus', show);
  header.addEventListener('mouseenter', show);
  header.addEventListener('mouseleave', scheduleHide);
  header.addEventListener('focusin', show);
  header.addEventListener('focusout', scheduleHide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && window.scrollY > 8) hide();
  });

  if (window.scrollY <= 8) show();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncActiveSection, { once: true });
  } else {
    syncActiveSection();
  }
})();
