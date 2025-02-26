const {createCanvas, loadImage} = require('canvas');
const styles = require('../util/style');
const {getSkin} = require("../util/getSkin");

async function bodyBuilder(username, scale, style) {
    try {
        const skinData = await getSkin(username)
        const img = await loadImage(skinData.url);
        const canvas = createCanvas(16 * scale, 32 * scale);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const isSlim = skinData.model === "slim";
        const armWidth = isSlim ? 3:4;
        const armPlacement = isSlim ? scale : 0;

        // i dont ever want to look at this again!!!!

        // head
        ctx.drawImage(img, 8, 8, 8, 8, 4 * scale, 0, 8 * scale, 8 * scale);
        // head layer
        ctx.drawImage(img, 40, 8, 8, 8, 4 * scale, 0, 8 * scale, 8 * scale);

        // body
        ctx.drawImage(img, 20, 20, 8, 12, 4 * scale, 8 * scale, 8 * scale, 12 * scale);
        // body layer
        ctx.drawImage(img, 20, 36, 8, 12, 4 * scale, 8 * scale, 8 * scale, 12 * scale);

        // left leg
        ctx.drawImage(img, 4, 20, 4, 12, 4 * scale, 20 * scale, 4 * scale, 12 * scale);
        // left leg layer
        ctx.drawImage(img, 4, 36, 4, 12, 4 * scale, 20 * scale, 4 * scale, 12 * scale);

        // right leg
        ctx.drawImage(img, 20, 52, 4, 12, 8 * scale, 20 * scale, 4 * scale, 12 * scale);
        // right leg layer
        ctx.drawImage(img, 4, 52, 4, 12, 8 * scale, 20 * scale, 4 * scale, 12 * scale);

        // left arm
        ctx.drawImage(img, 44, 20, armWidth, 12, armPlacement, 8 * scale, armWidth * scale, 12 * scale);
        // left arm layer
        ctx.drawImage(img, 44, 36, armWidth, 12, armPlacement, 8 * scale, armWidth * scale, 12 * scale);

        // right arm
        ctx.drawImage(img, 36, 52, armWidth, 12, 12 * scale, 8 * scale, armWidth * scale, 12 * scale);
        // right arm layer
        ctx.drawImage(img,52, 52, armWidth, 12, 12 * scale, 8 * scale, armWidth * scale, 12 * scale);

        if (style && styles[style]) {
            styles[style](ctx, 32 * scale);
        }

        return canvas;
    } catch (error) {
        console.error('Error in bodyBuilder:', error);
        throw new Error(error.message);
    }
}

module.exports = {bodyBuilder};
