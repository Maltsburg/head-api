const { createCanvas } = require('canvas');
const {skinBuilder} = require("../skin/skinBuilder");

async function headBuilder(username, size, style = 'default') {
    try {
        const img = await skinBuilder(username, 1, style);
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 4, 0, 8, 8, 0, 0, size, size);

        return canvas;
    } catch (error) {
        console.error('Error in headBuilder:', error);
        throw new Error(error.message);
    }
}

module.exports = { headBuilder };