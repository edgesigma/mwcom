// Perlin noise generation using f5.js
function generatePerlinNoiseBackground(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const noise = f5.noise.perlin;
    const scale = 0.1;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const value = noise(x * scale, y * scale);
            const color = Math.floor((value + 1) * 128); // Adjusted to fit 0-255 range
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

// Call this function on page load
window.onload = function() {
    generatePerlinNoiseBackground('footerCanvas');
};
