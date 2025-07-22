document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('gallery-carousel-1');
  const player = document.getElementById('player');
  const caption = document.getElementById('video-caption');

  // Add a CSS transition for smooth height change
  player.style.transition = 'height 0.4s cubic-bezier(.4,0,.2,1)';

  if (carousel && player && caption) {
    carousel.addEventListener('click', function (e) {
      const img = e.target.closest('img[data-video]');
      if (img) {
        const videoSrc = img.getAttribute('data-video');
        const videoCaption = img.getAttribute('data-caption') || '';

        // Create a temp video to measure new height
        const tempVideo = document.createElement('video');
        tempVideo.src = videoSrc;
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        tempVideo.autoplay = false;
        tempVideo.preload = 'metadata';

        tempVideo.addEventListener('loadedmetadata', function () {
          // Calculate aspect ratio and new height
          const aspectRatio = tempVideo.videoWidth / tempVideo.videoHeight;
          const containerWidth = player.offsetWidth;
          const newHeight = containerWidth / aspectRatio;
          // Animate video height
          player.style.height = `${newHeight}px`;
          // Switch video source
          player.src = videoSrc;
          player.load();
          player.play();
          // Update caption
          caption.textContent = videoCaption;
        });

        tempVideo.load();
      }
    });
  }
});