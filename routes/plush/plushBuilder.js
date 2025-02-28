const { createCanvas } = require('canvas');
const { bodyBuilder } = require("../body/bodyBuilder");

async function plushBuilder(username, style = 'default') {
    try {
        const img = await bodyBuilder(username, 1, style);
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // head
        ctx.drawImage(img, 4, 0, 8, 8, 112, 0, 288, 288);

        // left leg
        ctx.drawImage(img, 4, 20, 4, 12, 184, 448, 48, 64);

        // right leg
        ctx.drawImage(img, 8, 20, 4, 12, 280, 448, 48, 64);

        // left arm
        ctx.save();
        ctx.translate(17, 42);
        ctx.rotate(45 * (Math.PI / 180));
        ctx.drawImage(img, 0, 8, 4, 12, 285, 73, 64, 96);
        ctx.restore();

        // right arm
        ctx.save();
        ctx.translate(47, 42);
        ctx.rotate(-45 * (Math.PI / 180));
        ctx.drawImage(img, 12, 8, 4, 12, -32, 390, 64, 96);
        ctx.restore();

        // body
        ctx.drawImage(img, 4, 8, 8, 12, 168, 288, 176, 160);

        return canvas;
    } catch (error) {
        console.error('Error in plushBuilder:', error);
        throw new Error(error.message);
    }
}

module.exports = { plushBuilder };
