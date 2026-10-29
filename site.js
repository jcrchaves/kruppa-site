const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-nav');
function closeMenu() { menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); }
toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });
// Login uses Kflow. Temporary application email links keep their native href.
// A local development address must never become a live site's destination.
const localHost = hostname => ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
let platform = null;
try {
  const url = new URL(window.KRUPPA_KFLOW_URL);
  if ((url.protocol === 'https:' || (url.protocol === 'http:' && localHost(url.hostname))) &&
      (!localHost(url.hostname) || localHost(window.location.hostname)) && !url.username && !url.password) {
    url.hash = ''; url.search = ''; platform = url;
  }
} catch { /* Remain disabled until a valid destination is configured. */ }
document.querySelectorAll('[data-kflow-route]').forEach(link => {
  if (!platform) { link.removeAttribute('href'); link.setAttribute('aria-disabled', 'true'); link.title = 'Endereço do Kflow por configurar'; return; }
  const target = new URL(platform.href);
  target.hash = link.dataset.kflowRoute === 'admission' ? 'manifestacao' : '';
  link.href = target.href;
  link.removeAttribute('aria-disabled'); link.removeAttribute('title');
});


// Highlight the section at the reading position, including its photo gallery.
const sectionLinks = [...document.querySelectorAll('.desktop-nav a, #mobile-nav a')];
const navigationSections = [...new Set(sectionLinks.map(link => link.getAttribute('href')))]
  .map(hash => document.querySelector(hash)).filter(Boolean);
let navigationFrame = null;
function updateNavigation() {
  navigationFrame = null;
  const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
  const atEnd = window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
  const readingLine = atEnd ? innerHeight : headerHeight + Math.min(130, innerHeight * .18);
  let current = null;
  let closestTop = -Infinity;
  navigationSections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= readingLine && top > closestTop) {
      current = section.id;
      closestTop = top;
    }
  });
  sectionLinks.forEach(link => {
    if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function queueNavigationUpdate() {
  if (navigationFrame === null) navigationFrame = requestAnimationFrame(updateNavigation);
}
window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
window.addEventListener('resize', queueNavigationUpdate);
window.addEventListener('load', queueNavigationUpdate);
queueNavigationUpdate();
