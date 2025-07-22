document.addEventListener('DOMContentLoaded', function () {
  const scrollContainer = document.querySelector('.scrollContainer');
  if (!scrollContainer) return;

  let lastY = null;
  let lastX = null;
  let isTouching = false;
  let isMouseDown = false;
  let scrollLockActive = false;

  // Helper: should proxy scroll?
  function shouldProxyScroll() {
    const rect = scrollContainer.getBoundingClientRect();
    // When scrollContainer is at the top of viewport (or above)
    return Math.round(rect.top) <= 0 && Math.round(rect.bottom) > 0;
  }

  // Helper: lock/unlock page scroll
  function lockPageScroll() {
    if (!scrollLockActive) {
      document.body.style.overflow = 'hidden';
      scrollLockActive = true;
      console.log('[scroll-proxy] Page scroll LOCKED (body overflow hidden)');
    }
  }
  function unlockPageScroll() {
    if (scrollLockActive) {
      document.body.style.overflow = '';
      scrollLockActive = false;
      console.log('[scroll-proxy] Page scroll UNLOCKED (body overflow reset)');
    }
  }

  // Watch scroll to lock/unlock page scroll
  function checkScrollLock() {
    const rect = scrollContainer.getBoundingClientRect();
    const footer = document.querySelector('footer');
    const footerRect = footer ? footer.getBoundingClientRect() : { top: 0, bottom: 0 };

    // Only lock scroll if .scrollContainer is fully in the viewport
    // AND the footer is NOT visible at all
    if (
      rect.top >= 0 &&
      rect.bottom <= window.innerHeight &&
      (!footer || footerRect.top >= window.innerHeight)
    ) {
      if (!scrollLockActive) {
        console.log('[scroll-proxy] .scrollContainer fully in viewport and footer not visible, locking page scroll');
      }
      lockPageScroll();
    } else {
      if (scrollLockActive) {
        console.log('[scroll-proxy] .scrollContainer not fully in viewport or footer visible, unlocking page scroll');
      }
      unlockPageScroll();
    }
  }
  window.addEventListener('scroll', checkScrollLock, { passive: true });
  // Also check on resize
  window.addEventListener('resize', checkScrollLock, { passive: true });
  // Initial check
  checkScrollLock();

  // Touch events (mobile)
  window.addEventListener('touchstart', (e) => {
    if (shouldProxyScroll()) {
      isTouching = true;
      lastY = e.touches[0].clientY;
      console.log('[scroll-proxy] Touch start: proxying scroll to .scrollContainer');
    } else {
      isTouching = false;
      lastY = null;
      console.log('[scroll-proxy] Touch start: normal page scroll');
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!isTouching) return;
    const currentY = e.touches[0].clientY;
    const deltaY = lastY - currentY;
    lastY = currentY;

    // If scrollContainer can scroll further in this direction
    if ((deltaY > 0 && scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) ||
        (deltaY < 0 && scrollContainer.scrollTop > 0)) {
      scrollContainer.scrollTop += deltaY;
      e.preventDefault();
      console.log('[scroll-proxy] Touch move: scrolling .scrollContainer by', deltaY);
    }
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isTouching = false;
    lastY = null;
    console.log('[scroll-proxy] Touch end');
  });

  // Mouse events (desktop)
  window.addEventListener('mousedown', (e) => {
    if (shouldProxyScroll() && e.button === 0) {
      isMouseDown = true;
      lastY = e.clientY;
      lastX = e.clientX;
      document.body.style.userSelect = 'none';
      console.log('[scroll-proxy] Mouse down: proxying scroll to .scrollContainer');
    }
  });
  window.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const deltaY = lastY - e.clientY;
    lastY = e.clientY;
    // Only vertical scroll
    if ((deltaY > 0 && scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) ||
        (deltaY < 0 && scrollContainer.scrollTop > 0)) {
      scrollContainer.scrollTop += deltaY;
      e.preventDefault();
      console.log('[scroll-proxy] Mouse move: scrolling .scrollContainer by', deltaY);
    }
  });
  window.addEventListener('mouseup', () => {
    isMouseDown = false;
    lastY = null;
    document.body.style.userSelect = '';
    console.log('[scroll-proxy] Mouse up');
  });

  // Wheel events (desktop)
  window.addEventListener('wheel', (e) => {
    if (!shouldProxyScroll()) return;
    // Only proxy if scrollContainer can scroll in this direction
    if ((e.deltaY > 0 && scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) ||
        (e.deltaY < 0 && scrollContainer.scrollTop > 0)) {
      scrollContainer.scrollTop += e.deltaY;
      e.preventDefault();
      console.log('[scroll-proxy] Wheel: scrolling .scrollContainer by', e.deltaY);
    }
  }, { passive: false });
});