const { createCanvas} = require('canvas');
const { bodyBuilder } = require("../body/bodyBuilder");

async function torsoBuilder(username, size, style = 'default') {
    try {
        const img = await bodyBuilder(username, 1, style);
        const scale = 16 * size
        const canvas = createCanvas(scale, scale);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, 16, 16, 0, 0, scale, scale);

        return canvas;
    } catch (error) {
        console.error('Error in torsoBuilder:', error);
        throw new Error(error.message);
    }
}

module.exports = { torsoBuilder };
