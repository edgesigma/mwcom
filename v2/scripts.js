// ==================== HERO PHOTO ROTATION ====================
(function () {
  const heroImages = [
    '/img-temp/pfp/16908425_1237161003006113_4796314937221709824_n.jpg',
    '/img-temp/pfp/19933152_150074122229269_3460226018176925696_n.jpg',
    '/img-temp/pfp/20634910_1304159146373791_2413335217314988032_n.jpg',
    '/img-temp/pfp/242447269_2896054844040944_7968185486704733650_n.jpg',
    '/img-temp/pfp/265942008_4886058971406114_8310174529552536656_n.jpeg',
    '/img-temp/pfp/271855436_510100316986509_5718197132407865480_n.jpeg',
    '/img-temp/pfp/284422572_979283019429137_2755411786017774232_n.jpeg',
    '/img-temp/pfp/46465186_369010213661394_6295429840230107647_n.jpg',
    '/img-temp/pfp/47582619_353538988797700_164052074848211876_n.jpg',
    '/img-temp/pfp/OoE_close.png',
  ];

  var heroDiv = document.getElementById('hero-photo');
  if (!heroDiv || heroImages.length === 0) return;

  var currentIndex = parseInt(localStorage.getItem('lastHeroImageIndex'), 10) || 0;
  currentIndex = (currentIndex + 1) % heroImages.length;

  // Preload next image to avoid flash on transition
  function preload(src) {
    var img = new Image();
    img.src = src;
  }

  function show(index) {
    heroDiv.style.opacity = '0';
    setTimeout(function () {
      heroDiv.style.backgroundImage = "url('" + heroImages[index] + "')";
      heroDiv.style.opacity = '1';
      localStorage.setItem('lastHeroImageIndex', index);
      // Preload the next one
      preload(heroImages[(index + 1) % heroImages.length]);
    }, 600);
  }

  // Set up the crossfade transition
  heroDiv.style.transition = 'opacity 0.6s ease';
  heroDiv.style.backgroundImage = "url('" + heroImages[currentIndex] + "')";
  localStorage.setItem('lastHeroImageIndex', currentIndex);
  preload(heroImages[(currentIndex + 1) % heroImages.length]);

  // Cycle every 8 seconds
  setInterval(function () {
    currentIndex = (currentIndex + 1) % heroImages.length;
    show(currentIndex);
  }, 8000);
})();

// ==================== VIDEO SWITCHER ====================
(function () {
  const carousel = document.getElementById('gallery-carousel-1');
  const player = document.getElementById('gallery-player');
  const caption = document.getElementById('gallery-caption');

  if (!carousel || !player || !caption) return;

  // Handle thumbnail clicks — switch video and update active state
  carousel.addEventListener('click', function (e) {
    const thumb = e.target.closest('.thumb-item');
    if (!thumb) return;
    const img = thumb.querySelector('img[data-video]');
    if (!img) return;

    carousel.querySelectorAll('img').forEach(function (i) { i.classList.remove('active'); });
    img.classList.add('active');

    player.src = img.getAttribute('data-video');
    player.load();
    player.play();
    caption.textContent = img.getAttribute('data-caption') || '';
  });

  // Arrow navigation
  var wrapper = carousel.closest('.carousel-wrapper');
  if (wrapper) {
    wrapper.querySelector('.carousel-arrow.left').addEventListener('click', function () {
      carousel.scrollBy({ left: -200, behavior: 'smooth' });
    });
    wrapper.querySelector('.carousel-arrow.right').addEventListener('click', function () {
      carousel.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }
})();

// ==================== SCROLL FADE-IN ====================
(function () {
  const targets = document.querySelectorAll('.project, #about, #projects, #technologies');
  targets.forEach(function (el) { el.classList.add('fade-in'); });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) { observer.observe(el); });
})();

// ==================== LANGTON'S ANT (FOOTER) ====================
(function () {
  const CELL_SIZE = 2;
  const COLOR_ALIVE = '#3a3a5c';
  const COLOR_DEAD = '#1a1a2e';
  const COLOR_ANT = '#e0e0e0';

  const canvas = document.getElementById('grid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  const ANTUP = 0, ANTRIGHT = 1, ANTDOWN = 2, ANTLEFT = 3;

  class Ant {
    constructor() { this.x = 0; this.y = 0; this.direction = ANTUP; }
    moveForward(w, h) {
      if (this.direction === ANTUP) this.y = ((this.y - 1) + h) % h;
      else if (this.direction === ANTRIGHT) this.x = ((this.x + 1) + w) % w;
      else if (this.direction === ANTDOWN) this.y = ((this.y + 1) + h) % h;
      else this.x = ((this.x - 1) + w) % w;
    }
    rotateRight() { this.direction = (this.direction + 1) % 4; }
    rotateLeft() { this.direction = (this.direction + 3) % 4; }
  }

  let cells, ant, gridW, gridH, moves;

  function init() {
    resize();
    gridW = Math.floor(canvas.width / CELL_SIZE);
    gridH = Math.floor(canvas.height / CELL_SIZE);
    cells = [];
    for (let x = 0; x < gridW; x++) {
      cells[x] = new Uint8Array(gridH);
    }
    ant = new Ant();
    ant.x = Math.floor(gridW / 2);
    ant.y = Math.floor(gridH / 2);
    moves = 0;
    ctx.fillStyle = COLOR_DEAD;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function step() {
    // Erase previous ant position (redraw the cell underneath)
    var prevAlive = cells[ant.x][ant.y];
    ctx.fillStyle = prevAlive ? COLOR_ALIVE : COLOR_DEAD;
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    for (let i = 0; i < 100; i++) {
      const alive = cells[ant.x][ant.y];
      if (alive) {
        cells[ant.x][ant.y] = 0;
        ctx.fillStyle = COLOR_DEAD;
        ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ant.rotateRight();
      } else {
        cells[ant.x][ant.y] = 1;
        ctx.fillStyle = COLOR_ALIVE;
        ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ant.rotateLeft();
      }
      ant.moveForward(gridW, gridH);
      moves++;
      if (moves >= 25000) { init(); return; }
    }

    // Draw ant as a bright cell
    ctx.fillStyle = COLOR_ANT;
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  init();
  setInterval(step, 1000 / 8);
  window.addEventListener('resize', init);
})();

// ==================== POSTHOG ====================
(function () {
  // eslint-disable-next-line
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var c=e;for(void 0!==a?c=e[a]=[]:a="posthog",c.people=c.people||[],c.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},c.people.toString=function(){return c.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once reset group add_group remove_group track_pageview register unregister get_distinct_id get_property get_feature_flag onFeatureFlags reloadFeatureFlags isFeatureEnabled onFeatureFlag".split(" "),n=0;n<o.length;n++)g(c,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_a94fsl13aOmdJkNocQWfiMvzZjmqhbssuCnDh56PN4u', { api_host: 'https://app.posthog.com' });

  var env = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'development' : 'production';
  posthog.register({ env: env });

  // Track outbound links
  document.body.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (link && link.href && link.hostname !== location.hostname) {
      posthog.capture('outbound_link_click', { href: link.href, text: link.textContent.trim() });
    }
  });

  // Track section views
  var sections = document.querySelectorAll('.project-header');
  var seen = new Set();
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          posthog.capture('section_view', { section: entry.target.textContent.trim() });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { observer.observe(s); });
  }
})();
