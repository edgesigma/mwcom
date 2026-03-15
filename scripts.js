// ==================== SERVICE WORKER ====================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// ==================== HERO PHOTO ROTATION ====================
(function () {
  const heroImages = [
    { src: 'https://storage.googleapis.com/mwcom-media/img/pfp/287213517_734802487967433_6188730041225448536_n.jpeg',
      caption: 'Ocean of Eyes (detail), 2023' },
    { src: 'https://storage.googleapis.com/mwcom-media/img/pfp/301436364_153064617397157_2804266410779234985_n.jpg',
      caption: '934 + Digital Garage Design Thinking Camp, 2022' },
    { src: 'https://storage.googleapis.com/mwcom-media/img/pfp/367508911_257309977236903_6686988081987592737_n.jpeg',
      caption: '934 Mural Fest — Media Facade, 2023' },
    { src: 'https://storage.googleapis.com/mwcom-media/img/pfp/blood-swirl.png',
      caption: 'Chiasm, 2023' },
    { src: 'https://storage.googleapis.com/mwcom-media/img/pfp/ocean.png',
      caption: 'Ocean of Eyes, 2023' },
    { src: 'https://storage.googleapis.com/mwcom-media/img/pfp/pink.png',
      caption: 'Ocean of Eyes (viewer interacting), 2023' },
  ];

  var heroDiv = document.getElementById('hero-photo');
  if (!heroDiv || heroImages.length === 0) return;

  // Create two stacked layers for crossfade
  var layerA = document.createElement('div');
  var layerB = document.createElement('div');
  layerA.className = 'hero-photo-layer';
  layerB.className = 'hero-photo-layer';
  layerB.style.opacity = '0';
  heroDiv.appendChild(layerA);
  heroDiv.appendChild(layerB);

  // Caption element
  var captionEl = document.createElement('div');
  captionEl.className = 'hero-caption';
  heroDiv.appendChild(captionEl);

  var frontLayer = layerA;
  var backLayer = layerB;

  var currentIndex = parseInt(localStorage.getItem('lastHeroImageIndex'), 10) || 0;
  currentIndex = (currentIndex + 1) % heroImages.length;

  function preload(src) {
    var img = new Image();
    img.src = src;
  }

  function updateCaption(index) {
    captionEl.style.opacity = '0';
    setTimeout(function () {
      captionEl.textContent = heroImages[index].caption;
      captionEl.style.opacity = '1';
    }, 500);
  }

  function show(index) {
    // Set next image on the back layer, then crossfade
    backLayer.style.backgroundImage = "url('" + heroImages[index].src + "')";
    backLayer.style.opacity = '1';
    frontLayer.style.opacity = '0';

    updateCaption(index);

    localStorage.setItem('lastHeroImageIndex', index);
    preload(heroImages[(index + 1) % heroImages.length].src);

    // Swap layer roles after transition completes
    var prev = frontLayer;
    frontLayer = backLayer;
    backLayer = prev;
  }

  // Initial image
  frontLayer.style.backgroundImage = "url('" + heroImages[currentIndex].src + "')";
  frontLayer.style.opacity = '1';
  captionEl.textContent = heroImages[currentIndex].caption;
  localStorage.setItem('lastHeroImageIndex', currentIndex);
  preload(heroImages[(currentIndex + 1) % heroImages.length].src);

  // Cycle every 8 seconds
  setInterval(function () {
    currentIndex = (currentIndex + 1) % heroImages.length;
    show(currentIndex);
  }, 8000);
})();

// ==================== VIDEO SWITCHER ====================
(function () {
  var blobCache = {};

  function fetchAsBlob(url) {
    if (blobCache[url]) return Promise.resolve(blobCache[url]);
    return fetch(url).then(function (res) { return res.blob(); }).then(function (blob) {
      blobCache[url] = URL.createObjectURL(blob);
      return blobCache[url];
    }).catch(function () {
      // CORS or network error — fall back to direct URL
      return url;
    });
  }

  var carousels = [
    { carousel: 'gallery-carousel-1', player: 'gallery-player', caption: 'gallery-caption' },
    { carousel: 'fidget-carousel', player: 'fidget-player', caption: 'fidget-caption' }
  ];

  carousels.forEach(function (cfg) {
    var carousel = document.getElementById(cfg.carousel);
    var player = document.getElementById(cfg.player);
    var caption = document.getElementById(cfg.caption);
    if (!carousel || !player || !caption) return;

    // Cache the initial video's blob URL on first play
    var initialSrc = player.getAttribute('src');
    if (initialSrc) {
      fetchAsBlob(initialSrc).then(function (blobUrl) {
        var currentTime = player.currentTime;
        var wasPlaying = !player.paused;
        player.src = blobUrl;
        player.currentTime = currentTime;
        if (wasPlaying) player.play();
      });
    }

    // Handle thumbnail clicks — switch video and update active state
    carousel.addEventListener('click', function (e) {
      var thumb = e.target.closest('.thumb-item');
      if (!thumb) return;
      var media = thumb.querySelector('[data-video]');
      if (!media) return;

      var videoUrl = media.getAttribute('data-video');

      carousel.querySelectorAll('[data-video]').forEach(function (el) { el.classList.remove('active'); });
      media.classList.add('active');

      var container = player.parentElement;
      var currentHeight = container.offsetHeight;
      container.style.height = currentHeight + 'px';

      // Phase 1: fade out current video
      player.classList.add('fade-out');

      setTimeout(function () {
        // Phase 2: load video from blob cache or fetch
        fetchAsBlob(videoUrl).then(function (blobUrl) {
          player.src = blobUrl;
          player.load();

          player.addEventListener('loadedmetadata', function onMeta() {
            player.removeEventListener('loadedmetadata', onMeta);

            function fadeIn() {
              player.classList.remove('fade-out');
              player.play();
              container.style.height = '';
            }

            // Phase 3: morph container to new aspect ratio
            var oldHeight = container.offsetHeight;
            var newHeight = container.offsetWidth / (player.videoWidth / player.videoHeight);
            container.style.height = newHeight + 'px';

            // Phase 4: fade in after container finishes morphing
            // If height didn't change, transitionend won't fire — fade in directly
            if (Math.abs(newHeight - oldHeight) < 1) {
              fadeIn();
            } else {
              container.addEventListener('transitionend', function onMorph(e) {
                if (e.propertyName !== 'height') return;
                container.removeEventListener('transitionend', onMorph);
                fadeIn();
              });
            }
          });
        });
      }, 300);
      caption.textContent = media.getAttribute('data-caption') || '';
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

    // Play thumb videos on hover
    carousel.querySelectorAll('.thumb-video').forEach(function (vid) {
      var parent = vid.closest('.thumb-item');
      parent.addEventListener('mouseenter', function () { vid.play(); });
      parent.addEventListener('mouseleave', function () { vid.pause(); vid.currentTime = 0; });
    });
  });
})();

// ==================== VIEWPORT AUTOPLAY ====================
(function () {
  var videos = document.querySelectorAll('.feature-video video');
  if (!videos.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.play();
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.3 });

  videos.forEach(function (vid) { observer.observe(vid); });
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
