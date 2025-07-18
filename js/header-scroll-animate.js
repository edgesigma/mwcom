// Animate the header as .scrollContainer scrolls into view

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('header');
  const scrollContainer = document.querySelector('.scrollContainer');

  function animateHeader() {
    if (!header || !scrollContainer) return;
    const rect = scrollContainer.getBoundingClientRect();
    const vh = window.innerHeight;

    // Progress: 0 when scrollContainer bottom is at viewport bottom,
    // 1 when scrollContainer top is at viewport top
    const start = vh; // scrollContainer just entering
    const progress = Math.min(Math.max(1 - (rect.top / start), 0), 1);

    // REVERSED: rotateX from 0deg to 30deg, translateY from 0 to 100px, blur from 0 to 8px
    const rotate = 15 * progress; // 0deg -> 30deg
    const translateY = 100 * progress; // 0 -> 100px
    const maxBlur = 8; // px

    header.style.transform = `perspective(800px) rotateX(${rotate}deg) translateY(${translateY}px)`;
    header.style.transformStyle = 'preserve-3d';
    header.style.filter = `blur(${maxBlur * progress}px)`;
  }

  window.addEventListener('scroll', animateHeader, { passive: true });
  window.addEventListener('resize', animateHeader, { passive: true });
  animateHeader();
});
