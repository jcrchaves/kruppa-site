// Public media already used by kkruppa.com. Keep the files in the original
// Wix library when implementing this design in the site's editor.
const media = {
  video: 'https://video.wixstatic.com/video/f95e60_2db7d52ed0a242068672c81f26798016/1080p/mp4/file.mp4',
  gallery: [
    'https://static.wixstatic.com/media/ccd1ea_f0a5097d4e754ac69be711db322708f1~mv2_d_5295_3861_s_4_2.jpg/v1/fill/w_480,h_361,fp_0.6_0.55,q_90,enc_avif,quality_auto/ccd1ea_f0a5097d4e754ac69be711db322708f1~mv2_d_5295_3861_s_4_2.jpg',
    'https://static.wixstatic.com/media/ccd1ea_8eaf5dcb05ed48b1a6214bc823ecf62c~mv2.png/v1/fill/w_480,h_361,fp_0.51_0.39,q_90,enc_avif,quality_auto/ccd1ea_8eaf5dcb05ed48b1a6214bc823ecf62c~mv2.png',
    'https://static.wixstatic.com/media/ccd1ea_dbce533e982f438b8c18e11ef6d97379~mv2_d_5760_3840_s_4_2.jpg/v1/fit/w_480,h_361,q_90,enc_avif,quality_auto/ccd1ea_dbce533e982f438b8c18e11ef6d97379~mv2_d_5760_3840_s_4_2.jpg'
  ],
  creche: 'https://static.wixstatic.com/media/ccd1ea_a48a9e4f9f564f698ac2909681d637ad~mv2.png/v1/fill/w_58,h_36,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Creche.png',
  preschool: 'https://static.wixstatic.com/media/ccd1ea_a1457383fafe46e19926716574ea5cd4~mv2.png/v1/fill/w_58,h_47,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pr%C3%A9-Escolar.png'
};

document.querySelectorAll('.offer-card .card-symbol').forEach((symbol, index) => {
  // Share the hero's vector geometry; no enlarged low-resolution icons.
  const ns = 'http://www.w3.org/2000/svg';
  const illustration = document.createElementNS(ns, 'svg');
  illustration.setAttribute('viewBox', index === 0 ? '0 0 120 140' : '0 0 240 230');
  illustration.setAttribute('focusable', 'false');
  const positions = index === 0 ? [[0, 0]] : [[0, 85], [115, 85], [58, 0]];
  positions.forEach(([x, y]) => {
    const cube = document.createElementNS(ns, 'use');
    cube.setAttribute('href', '#kruppa-cube');
    cube.setAttribute('x', String(x)); cube.setAttribute('y', String(y));
    cube.setAttribute('width', '120'); cube.setAttribute('height', '140');
    illustration.append(cube);
  });
  symbol.replaceChildren(illustration);
});

const gallery = document.createElement('section');
gallery.className = 'gallery-section section-wrap';
gallery.setAttribute('aria-labelledby', 'gallery-title');
gallery.innerHTML = '<div class="section-heading"><div><p class="eyebrow">A vida acontece aqui</p><h2 id="gallery-title">Um pouco do <em>nosso mundo.</em></h2></div><a class="text-link" href="#contactos">Vamos conhecer-nos ↗</a></div><div class="photo-grid"></div>';
media.gallery.forEach((url, index) => {
  const frame = document.createElement('figure');
  const image = document.createElement('img');
  image.src = url; image.alt = `Imagem ${index + 1} da galeria do Centro Infantil Kruppa`;
  image.width = 480; image.height = 361; image.loading = 'lazy'; image.decoding = 'async';
  frame.append(image);
  image.addEventListener('error', () => { frame.hidden = true; });
  gallery.querySelector('.photo-grid').append(frame);
});
document.querySelector('#sobre').after(gallery);

const cover = document.querySelector('#play-film');
const video = document.querySelector('#kruppa-video');
const status = document.querySelector('#film-status');
// Reuse the original public photo as a cover, without duplicating the cubes.
const coverImage = document.createElement('img');
coverImage.className = 'film-cover-photo';
coverImage.src = media.gallery[0].replace('w_480,h_361', 'w_1200,h_900');
coverImage.alt = ''; coverImage.setAttribute('aria-hidden', 'true');
coverImage.width = 1200; coverImage.height = 900;
coverImage.loading = 'lazy'; coverImage.decoding = 'async';
coverImage.addEventListener('load', () => cover.classList.add('has-photo'));
coverImage.addEventListener('error', () => { coverImage.remove(); cover.classList.remove('has-photo'); });
cover.prepend(coverImage);
let requested = false;
cover.addEventListener('click', async () => {
  if (requested) return;
  requested = true;
  video.src = media.video;
  video.hidden = false; cover.hidden = true;
  status.textContent = 'A carregar o vídeo…'; status.hidden = false;
  video.focus();
  try { await video.play(); status.hidden = true; }
  catch { if (!video.error) { status.textContent = 'Usa o botão de reprodução para começar o vídeo.'; } }
});
video.addEventListener('playing', () => { status.hidden = true; });
video.addEventListener('error', () => {
  requested = false;
  video.hidden = true; cover.hidden = false;
  status.replaceChildren(document.createTextNode('Não foi possível carregar o vídeo. '));
  const link = document.createElement('a'); link.href = media.video;
  link.textContent = 'Abrir o vídeo original'; status.append(link); status.hidden = false;
});
