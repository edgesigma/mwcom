// Rotating hero background image script for mwcom
// Cycles through images in img/pfp/ on each pageload, never repeating consecutively

// List your hero images here
const heroImages = [
  'img/pfp/20634910_1304159146373791_2413335217314988032_n.jpg',
  'img/pfp/20634910_1304159146373791_2413335217314988032_n.jpg',
  'img/pfp/242447269_2896054844040944_7968185486704733650_n.jpg',
  'img/pfp/265942008_4886058971406114_8310174529552536656_n.jpeg',
  'img/pfp/271855436_510100316986509_5718197132407865480_n.jpeg',
  'img/pfp/284422572_979283019429137_2755411786017774232_n.jpeg',
  'img/pfp/46465186_369010213661394_6295429840230107647_n.jpg',
  'img/pfp/47582619_353538988797700_164052074848211876_n.jpg',
];

document.addEventListener('DOMContentLoaded', function () {
  const heroDiv = document.getElementById('hero');
  if (!heroDiv || heroImages.length === 0) return;

  // Get last index from localStorage
  const lastIndex = parseInt(localStorage.getItem('lastHeroImageIndex'), 10);
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * heroImages.length);
  } while (heroImages.length > 1 && newIndex === lastIndex);

  // Set background image
  heroDiv.style.backgroundImage = `url('${heroImages[newIndex]}')`;
  heroDiv.style.backgroundSize = 'cover';
  heroDiv.style.backgroundPosition = 'center';

  // Store new index for next pageload
  localStorage.setItem('lastHeroImageIndex', newIndex);
});
