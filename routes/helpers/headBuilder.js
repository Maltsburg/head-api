const { createCanvas, loadImage } = require('canvas');

async function headBuilder(skinUrl, size) {
    try {
        const img = await loadImage(skinUrl);
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // no smoothing to keep it pixelated

        ctx.drawImage(img, 8, 8, 8, 8, 0, 0, size, size); // head layer
        ctx.drawImage(img, 40, 8, 8, 8, 0, 0, size, size); // hat layer

        return canvas;
    } catch (error) {
        console.error('Error in headBuilder:', error);
        throw new Error(error.message);
    }
}

module.exports = { headBuilder };